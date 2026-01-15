"""
LLM Service - Production-Ready Multi-Provider LLM Integration
Supports: OpenRouter, Anthropic, OpenAI, Mistral, and more
"""

from typing import Union, Dict, Any, Optional, AsyncGenerator, List
import os
import json
import asyncio
import httpx
from core.utils.logger import logger
from core.utils.config import config
from core.agentpress.error_processor import ErrorProcessor
from pathlib import Path
from datetime import datetime, timezone
import time as time_module

# =============================================================================
# LITELLM INTEGRATION WITH FALLBACK
# =============================================================================

LITELLM_AVAILABLE = False
litellm = None
ModelResponse = None

# Try to import LiteLLM
try:
    import litellm as real_litellm
    from litellm import ModelResponse as RealModelResponse
    from litellm.callbacks import CustomLogger
    
    litellm = real_litellm
    ModelResponse = RealModelResponse
    LITELLM_AVAILABLE = True
    
    # Configure LiteLLM
    litellm.modify_params = True
    litellm.drop_params = True
    litellm.set_verbose = False
    litellm.num_retries = int(os.environ.get("LITELLM_NUM_RETRIES", 2))
    litellm.request_timeout = 1800  # 30 min for long streams
    
    logger.info("✅ LiteLLM loaded successfully - full LLM support enabled")
    
except ImportError as e:
    logger.warning(f"⚠️ LiteLLM not available ({e}) - using OpenRouter direct fallback")

    # Create mock classes for compatibility
    class CustomLogger:
        pass
    
    class MockModelResponse:
        def __init__(self, content="", **kwargs):
            self.choices = [MockChoice(content)]
            self.usage = MockUsage()
            self.model = kwargs.get('model', 'unknown')

    class MockChoice:
        def __init__(self, content):
            self.message = MockMessage(content)
            self.delta = MockMessage(content)
            self.finish_reason = None

    class MockMessage:
        def __init__(self, content):
            self.content = content
            self.role = "assistant"
            self.tool_calls = None

    class MockUsage:
        def __init__(self):
            self.prompt_tokens = 0
            self.completion_tokens = 0
            self.total_tokens = 0

    ModelResponse = MockModelResponse


# =============================================================================
# OPENROUTER DIRECT API (Fallback when LiteLLM unavailable)
# =============================================================================

# Get API key from config or environment
OPENROUTER_API_KEY = (
    getattr(config, 'OPENROUTER_API_KEY', None) or 
    os.environ.get('OPENROUTER_API_KEY') or
    os.environ.get('OPENROUTER_KEY') or
    # Fallback to the key from the frontend (for demo purposes)
    "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"
)

OPENROUTER_API_BASE = "https://openrouter.ai/api/v1"

# Model mapping for OpenRouter
MODEL_MAPPING = {
    # Claude models
    "claude-3.5-sonnet": "anthropic/claude-3.5-sonnet",
    "claude-3-opus": "anthropic/claude-3-opus",
    "claude-3-sonnet": "anthropic/claude-3-sonnet",
    "claude-3-haiku": "anthropic/claude-3-haiku",
    
    # GPT models
    "gpt-4-turbo": "openai/gpt-4-turbo",
    "gpt-4o": "openai/gpt-4o",
    "gpt-4o-mini": "openai/gpt-4o-mini",
    "gpt-4": "openai/gpt-4",
    "gpt-3.5-turbo": "openai/gpt-3.5-turbo",
    
    # Mistral models
    "mixtral-8x7b": "mistralai/mixtral-8x7b-instruct",
    "mistral-large": "mistralai/mistral-large",
    
    # Default
    "default": "anthropic/claude-3.5-sonnet",
}

def resolve_model_name(model_name: str) -> str:
    """Resolve model name to OpenRouter format."""
    if "/" in model_name:
        return model_name  # Already in OpenRouter format
    
    return MODEL_MAPPING.get(model_name, MODEL_MAPPING["default"])


async def openrouter_completion(
    messages: List[Dict[str, Any]],
    model: str = "anthropic/claude-3.5-sonnet",
    temperature: float = 0.7,
    max_tokens: int = 4096,
    stream: bool = True,
    tools: Optional[List[Dict[str, Any]]] = None,
    **kwargs
) -> AsyncGenerator:
    """
    Direct OpenRouter API call with streaming support.
    Used as fallback when LiteLLM is not available.
    """
    
    resolved_model = resolve_model_name(model)
    
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kortix.com",
        "X-Title": "Kortix AI Platform"
    }
    
    payload = {
        "model": resolved_model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": stream,
    }
    
    if tools:
        payload["tools"] = tools
        payload["tool_choice"] = kwargs.get("tool_choice", "auto")
    
    logger.info(f"[LLM] 🚀 OpenRouter call: model={resolved_model}, messages={len(messages)}, stream={stream}")
    
    start_time = time_module.monotonic()
    
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            if stream:
                async with client.stream(
                    "POST",
                    f"{OPENROUTER_API_BASE}/chat/completions",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status_code != 200:
                        error_text = await response.aread()
                        logger.error(f"[LLM] ❌ OpenRouter error: {response.status_code} - {error_text}")
                        raise LLMError(f"OpenRouter API error: {response.status_code}")
                    
                    ttft = time_module.monotonic() - start_time
                    logger.info(f"[LLM] ⏱️ TTFT: {ttft:.2f}s for {resolved_model}")
                    
                    async for line in response.aiter_lines():
                        if line.startswith("data: "):
                            data = line[6:]
                            if data == "[DONE]":
                                break
                            try:
                                chunk = json.loads(data)
                                yield chunk
                            except json.JSONDecodeError:
                                continue
                    
                    total_time = time_module.monotonic() - start_time
                    logger.info(f"[LLM] ✅ Stream completed: {total_time:.2f}s for {resolved_model}")
            else:
                response = await client.post(
                    f"{OPENROUTER_API_BASE}/chat/completions",
                    headers=headers,
                    json=payload
                )
                
                if response.status_code != 200:
                    logger.error(f"[LLM] ❌ OpenRouter error: {response.status_code} - {response.text}")
                    raise LLMError(f"OpenRouter API error: {response.status_code}")
                
                result = response.json()
                total_time = time_module.monotonic() - start_time
                logger.info(f"[LLM] ✅ Completed: {total_time:.2f}s for {resolved_model}")
                yield result
                
    except httpx.TimeoutException as e:
        logger.error(f"[LLM] ⏰ Timeout after {time_module.monotonic() - start_time:.2f}s: {e}")
        raise LLMError(f"Request timeout: {e}")
    except Exception as e:
        logger.error(f"[LLM] ❌ Error: {e}")
        raise LLMError(str(e))


# =============================================================================
# LLM TIMING CALLBACK
# =============================================================================

class LLMTimingCallback(CustomLogger):
    """Callback to log LiteLLM call timing and retry behavior."""
    
    def __init__(self):
        if LITELLM_AVAILABLE:
            super().__init__()
        self.call_times = {}
    
    def log_pre_api_call(self, model, messages, kwargs):
        """Called before each API call attempt."""
        call_id = id(kwargs)
        self.call_times[call_id] = time_module.monotonic()
        msg_count = len(messages) if messages else 0
        logger.info(f"[LLM] 🚀 PRE-API-CALL: model={model}, messages={msg_count}")
    
    def log_post_api_call(self, kwargs, response_obj, start_time, end_time):
        """Called after each API call."""
        call_id = id(kwargs)
        model = kwargs.get("model", "unknown")
        
        try:
            duration = (end_time - start_time).total_seconds()
        except:
            duration = 0
        
        if call_id in self.call_times:
            since_pre = time_module.monotonic() - self.call_times[call_id]
            logger.info(f"[LLM] ⏱️ POST-API: {model} | {duration:.2f}s")
            del self.call_times[call_id]
    
    def log_success_event(self, kwargs, response_obj, start_time, end_time):
        """Called on success."""
        model = kwargs.get("model", "unknown")
        try:
            duration = (end_time - start_time).total_seconds()
        except:
            duration = 0
        
        if duration > 10.0:
            logger.warning(f"[LLM] ⚠️ SLOW: {model} took {duration:.2f}s")
        else:
            logger.debug(f"[LLM] ✅ {model} in {duration:.2f}s")
    
    def log_failure_event(self, kwargs, response_obj, start_time, end_time):
        """Called on failure."""
        model = kwargs.get("model", "unknown")
        exception = kwargs.get("exception", response_obj)
        error_str = str(exception)[:200] if exception else "unknown"
        logger.error(f"[LLM] ❌ FAILURE: {model} - {error_str}")


# Register callback if LiteLLM available
if LITELLM_AVAILABLE:
    _timing_callback = LLMTimingCallback()
    litellm.callbacks = [_timing_callback]


# =============================================================================
# ERROR HANDLING
# =============================================================================

class LLMError(Exception):
    """Custom exception for LLM errors."""
    pass


# =============================================================================
# API KEY SETUP
# =============================================================================

def setup_api_keys() -> None:
    """Setup API keys from config to environment."""
    if not config:
        return
    
    # OpenRouter
    if getattr(config, 'OPENROUTER_API_KEY', None):
        os.environ["OPENROUTER_API_KEY"] = config.OPENROUTER_API_KEY
    if getattr(config, 'OPENROUTER_API_BASE', None):
        os.environ["OPENROUTER_API_BASE"] = config.OPENROUTER_API_BASE
    
    # OpenAI
    if getattr(config, 'OPENAI_API_KEY', None):
        os.environ["OPENAI_API_KEY"] = config.OPENAI_API_KEY
    
    # Anthropic
    if getattr(config, 'ANTHROPIC_API_KEY', None):
        os.environ["ANTHROPIC_API_KEY"] = config.ANTHROPIC_API_KEY
    
    # App metadata for OpenRouter
    if getattr(config, 'OR_APP_NAME', None):
        os.environ["OR_APP_NAME"] = config.OR_APP_NAME
    if getattr(config, 'OR_SITE_URL', None):
        os.environ["OR_SITE_URL"] = config.OR_SITE_URL
    

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

_INTERNAL_MESSAGE_PROPERTIES = {"message_id"}

def _strip_internal_properties(messages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Remove internal properties from messages before sending to LLM."""
    cleaned_messages = []
    for msg in messages:
        if not isinstance(msg, dict):
            cleaned_messages.append(msg)
            continue
        cleaned_msg = {k: v for k, v in msg.items() if k not in _INTERNAL_MESSAGE_PROPERTIES}
        cleaned_messages.append(cleaned_msg)
    return cleaned_messages


def _save_debug_input(params: Dict[str, Any]) -> None:
    """Save debug input to file for troubleshooting."""
    if not (config and getattr(config, 'DEBUG_SAVE_LLM_IO', False)):
        return
    
    try:
        debug_dir = Path("debug_streams")
        debug_dir.mkdir(exist_ok=True)
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S_%f")
        debug_file = debug_dir / f"input_{timestamp}.json"
        
        debug_data = {k: params.get(k) for k in 
            ["model", "messages", "temperature", "max_tokens", "stop", "stream", "tools"]}
        debug_data["timestamp"] = timestamp
        
        with open(debug_file, 'w', encoding='utf-8') as f:
            json.dump(debug_data, f, indent=2, ensure_ascii=False)
        logger.debug(f"[LLM] 📁 Saved debug input: {debug_file}")
    except Exception as e:
        logger.warning(f"[LLM] ⚠️ Error saving debug: {e}")


# =============================================================================
# MAIN LLM API CALL FUNCTION
# =============================================================================

LLM_DEBUG = os.environ.get("LLM_DEBUG", "true").lower() == "true"

async def make_llm_api_call(
    messages: List[Dict[str, Any]],
    model_name: str,
    response_format: Optional[Any] = None,
    temperature: float = 0.7,
    max_tokens: Optional[int] = None,
    tools: Optional[List[Dict[str, Any]]] = None,
    tool_choice: str = "auto",
    api_key: Optional[str] = None,
    api_base: Optional[str] = None,
    stream: bool = True,
    top_p: Optional[float] = None,
    model_id: Optional[str] = None,
    headers: Optional[Dict[str, str]] = None,
    extra_headers: Optional[Dict[str, str]] = None,
    stop: Optional[List[str]] = None,
) -> Union[Dict[str, Any], AsyncGenerator, Any]:
    """
    Make an LLM API call using LiteLLM or OpenRouter fallback.
    
    Args:
        messages: List of messages in OpenAI format
        model_name: Model identifier (e.g., "claude-3.5-sonnet", "gpt-4-turbo")
        temperature: Sampling temperature (0-2)
        max_tokens: Maximum tokens to generate
        tools: List of tool definitions
        stream: Whether to stream the response
        
    Returns:
        Streaming response generator or complete response
    """
    
    messages = _strip_internal_properties(messages)
    call_start = time_module.monotonic()
    
    # Handle mock model for testing
    if model_name == "mock-ai":
        logger.info(f"[LLM] 🎭 Using mock provider for testing")
        try:
            from core.test_harness.mock_llm import get_mock_provider
            mock_provider = get_mock_provider(delay_ms=20)
            return mock_provider.acompletion(
                messages=messages,
                model=model_name,
                stream=stream,
                tools=tools,
                temperature=temperature,
                max_tokens=max_tokens
            )
        except ImportError:
            # Return simple mock response
            async def mock_response():
                yield {"choices": [{"delta": {"content": "Mock response for testing"}}]}
            return mock_response()
    
    logger.info(f"[LLM] 📤 Call: {model_name} ({len(messages)} msgs, stream={stream})")
    
    # Use LiteLLM if available
    if LITELLM_AVAILABLE:
        try:
            from core.ai_models import model_manager
            resolved_model = model_manager.resolve_model_id(model_name) or model_name
    
            params = {
                "model": resolved_model,
                "messages": messages,
                "temperature": temperature,
                "stream": stream,
            }
    
            if max_tokens:
                params["max_tokens"] = max_tokens
            if response_format:
                params["response_format"] = response_format
            if top_p:
                params["top_p"] = top_p
            if api_key:
                params["api_key"] = api_key
            if api_base:
                params["api_base"] = api_base
            if stop:
                params["stop"] = stop
            if tools:
                params["tools"] = tools
                params["tool_choice"] = tool_choice
            if stream:
                params["stream_options"] = {"include_usage": True}

            _save_debug_input(params)
        
            logger.info(f"[LLM] 🎯 Using LiteLLM: {resolved_model}")
            response = await litellm.acompletion(**params)
            
            ttft = time_module.monotonic() - call_start
            logger.info(f"[LLM] ⏱️ TTFT: {ttft:.2f}s")
            
            if stream and hasattr(response, '__aiter__'):
                return _wrap_streaming_response(response, call_start, model_name)
            return response
        
        except Exception as e:
            logger.error(f"[LLM] ❌ LiteLLM error: {e}, falling back to OpenRouter")
    
    # Fallback to OpenRouter direct API
    logger.info(f"[LLM] 🔄 Using OpenRouter direct API: {model_name}")
    return openrouter_completion(
        messages=messages,
        model=model_name,
        temperature=temperature,
        max_tokens=max_tokens or 4096,
        stream=stream,
        tools=tools,
        tool_choice=tool_choice,
    )


async def _wrap_streaming_response(response, start_time: float, model_name: str) -> AsyncGenerator:
    """Wrap LiteLLM streaming response with logging."""
    chunk_count = 0
    try:
        async for chunk in response:
            chunk_count += 1
            yield chunk
    except Exception as e:
        processed_error = ErrorProcessor.process_llm_error(e)
        ErrorProcessor.log_error(processed_error)
        raise LLMError(processed_error.message)
    finally:
        duration = time_module.monotonic() - start_time if start_time else 0.0
        logger.info(f"[LLM] ✅ Stream done: {duration:.2f}s, {chunk_count} chunks for {model_name}")


# =============================================================================
# SIMPLE COMPLETION FUNCTION (For direct use)
# =============================================================================

async def simple_completion(
    prompt: str,
    model: str = "claude-3.5-sonnet",
    system_prompt: str = "You are a helpful AI assistant.",
    temperature: float = 0.7,
    max_tokens: int = 2000,
) -> str:
    """
    Simple completion for quick use cases.
    Returns the text content directly.
    """
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt}
    ]
    
    full_response = ""
    async for chunk in await make_llm_api_call(
        messages=messages,
        model_name=model,
        temperature=temperature,
        max_tokens=max_tokens,
        stream=True
    ):
        if isinstance(chunk, dict):
            content = chunk.get("choices", [{}])[0].get("delta", {}).get("content", "")
            full_response += content
    
    return full_response


# =============================================================================
# INITIALIZATION
# =============================================================================

setup_api_keys()

logger.info(
    f"[LLM] ✅ Module initialized | "
    f"LiteLLM: {'enabled' if LITELLM_AVAILABLE else 'disabled (OpenRouter fallback)'} | "
    f"Debug: {LLM_DEBUG}"
)

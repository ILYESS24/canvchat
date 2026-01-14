"""
Error Handler Module - Production-Ready Error Handling
Provides centralized error handling, logging, and user-friendly responses.
"""

from typing import Optional, Dict, Any, Type
from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from datetime import datetime, timezone
import traceback
import sys
from core.utils.logger import logger


# =============================================================================
# ERROR MODELS
# =============================================================================

class ErrorResponse(BaseModel):
    """Standard error response format."""
    success: bool = False
    error: str
    error_code: str
    message: str
    details: Optional[Dict[str, Any]] = None
    timestamp: str
    request_id: Optional[str] = None


class KortixError(Exception):
    """Base exception for Kortix AI platform."""
    
    def __init__(
        self, 
        message: str, 
        error_code: str = "INTERNAL_ERROR",
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}


class ValidationError(KortixError):
    """Validation error for invalid input."""
    def __init__(self, message: str, details: Optional[Dict] = None):
        super().__init__(message, "VALIDATION_ERROR", 400, details)


class AuthenticationError(KortixError):
    """Authentication error for invalid credentials."""
    def __init__(self, message: str = "Authentication required"):
        super().__init__(message, "AUTH_ERROR", 401)


class AuthorizationError(KortixError):
    """Authorization error for insufficient permissions."""
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, "FORBIDDEN", 403)


class NotFoundError(KortixError):
    """Resource not found error."""
    def __init__(self, resource: str = "Resource"):
        super().__init__(f"{resource} not found", "NOT_FOUND", 404)


class RateLimitError(KortixError):
    """Rate limit exceeded error."""
    def __init__(self, retry_after: int = 60):
        super().__init__(
            "Rate limit exceeded. Please try again later.",
            "RATE_LIMIT",
            429,
            {"retry_after": retry_after}
        )


class ExternalServiceError(KortixError):
    """External service (API, database) error."""
    def __init__(self, service: str, message: str):
        super().__init__(
            f"{service} error: {message}",
            "EXTERNAL_SERVICE_ERROR",
            503
        )


class LLMError(KortixError):
    """LLM/AI provider error."""
    def __init__(self, message: str, provider: str = "unknown"):
        super().__init__(
            message,
            "LLM_ERROR",
            502,
            {"provider": provider}
        )


class AgentError(KortixError):
    """Agent execution error."""
    def __init__(self, message: str, agent_id: Optional[str] = None):
        super().__init__(
            message,
            "AGENT_ERROR",
            500,
            {"agent_id": agent_id}
        )


# =============================================================================
# ERROR HANDLER
# =============================================================================

class ErrorHandler:
    """
    Centralized error handler with logging and formatting.
    
    Usage:
        try:
            risky_operation()
        except Exception as e:
            return ErrorHandler.handle(e, request)
    """
    
    # Map exception types to error codes
    ERROR_MAPPING: Dict[Type[Exception], tuple[str, int]] = {
        ValidationError: ("VALIDATION_ERROR", 400),
        AuthenticationError: ("AUTH_ERROR", 401),
        AuthorizationError: ("FORBIDDEN", 403),
        NotFoundError: ("NOT_FOUND", 404),
        RateLimitError: ("RATE_LIMIT", 429),
        ExternalServiceError: ("EXTERNAL_SERVICE_ERROR", 503),
        LLMError: ("LLM_ERROR", 502),
        AgentError: ("AGENT_ERROR", 500),
        ValueError: ("VALIDATION_ERROR", 400),
        KeyError: ("NOT_FOUND", 404),
        PermissionError: ("FORBIDDEN", 403),
        TimeoutError: ("TIMEOUT", 504),
        ConnectionError: ("CONNECTION_ERROR", 503),
    }
    
    @classmethod
    def handle(
        cls, 
        exception: Exception, 
        request: Optional[Request] = None,
        include_traceback: bool = False
    ) -> JSONResponse:
        """
        Handle an exception and return a formatted JSON response.
        
        Args:
            exception: The exception to handle
            request: Optional FastAPI request for context
            include_traceback: Include stack trace in response (dev only)
            
        Returns:
            JSONResponse with error details
        """
        # Get request ID if available
        request_id = None
        if request:
            request_id = getattr(request.state, 'request_id', None)
        
        # Handle KortixError (our custom errors)
        if isinstance(exception, KortixError):
            status_code = exception.status_code
            error_code = exception.error_code
            message = exception.message
            details = exception.details
        
        # Handle HTTPException (FastAPI errors)
        elif isinstance(exception, HTTPException):
            status_code = exception.status_code
            error_code = "HTTP_ERROR"
            message = str(exception.detail)
            details = {}
        
        # Handle known exception types
        elif type(exception) in cls.ERROR_MAPPING:
            error_code, status_code = cls.ERROR_MAPPING[type(exception)]
            message = str(exception)
            details = {}
        
        # Handle unknown exceptions
        else:
            status_code = 500
            error_code = "INTERNAL_ERROR"
            message = "An unexpected error occurred"
            details = {}
            
            # Log the full exception for debugging
            logger.error(
                f"Unhandled exception: {type(exception).__name__}: {exception}",
                exc_info=True
            )
        
        # Build response
        response_data = {
            "success": False,
            "error": type(exception).__name__,
            "error_code": error_code,
            "message": cls._sanitize_message(message),
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
        
        if details:
            response_data["details"] = details
        
        if request_id:
            response_data["request_id"] = request_id
        
        if include_traceback:
            response_data["traceback"] = traceback.format_exc()
        
        # Log error
        log_level = "warning" if status_code < 500 else "error"
        getattr(logger, log_level)(
            f"[{error_code}] {status_code} - {message} "
            f"(request_id: {request_id}, exception: {type(exception).__name__})"
        )
        
        return JSONResponse(
            status_code=status_code,
            content=response_data
        )
    
    @classmethod
    def _sanitize_message(cls, message: str) -> str:
        """Sanitize error message for user display."""
        # Remove sensitive information patterns
        sensitive_patterns = [
            "password",
            "secret",
            "api_key",
            "token",
            "credential",
        ]
        
        message_lower = message.lower()
        for pattern in sensitive_patterns:
            if pattern in message_lower:
                # Don't expose the actual values
                return "An error occurred. Please contact support if this persists."
        
        # Limit message length
        if len(message) > 500:
            message = message[:500] + "..."
        
        return message
    
    @classmethod
    def log_exception(
        cls, 
        exception: Exception,
        context: Optional[Dict[str, Any]] = None
    ) -> None:
        """Log an exception with context."""
        context = context or {}
        
        logger.error(
            f"Exception: {type(exception).__name__}: {exception}",
            extra={
                "exception_type": type(exception).__name__,
                "exception_message": str(exception),
                "context": context,
                "traceback": traceback.format_exc()
            }
        )


# =============================================================================
# EXCEPTION HANDLER MIDDLEWARE
# =============================================================================

async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Global exception handler for FastAPI app."""
    return ErrorHandler.handle(exc, request)


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def safe_execute(func, *args, default=None, **kwargs):
    """
    Execute a function safely, returning default on error.
    
    Usage:
        result = safe_execute(risky_function, arg1, arg2, default="fallback")
    """
    try:
        return func(*args, **kwargs)
    except Exception as e:
        logger.debug(f"safe_execute caught: {e}")
        return default


async def async_safe_execute(coro, default=None):
    """
    Execute a coroutine safely, returning default on error.
    
    Usage:
        result = await async_safe_execute(risky_coroutine(), default="fallback")
    """
    try:
        return await coro
    except Exception as e:
        logger.debug(f"async_safe_execute caught: {e}")
        return default


def wrap_error(func):
    """
    Decorator to wrap function errors in KortixError.
    
    Usage:
        @wrap_error
        def my_function():
            ...
    """
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except KortixError:
            raise
        except Exception as e:
            raise KortixError(str(e), "WRAPPED_ERROR")
    return wrapper


def async_wrap_error(func):
    """
    Async decorator to wrap coroutine errors in KortixError.
    """
    async def wrapper(*args, **kwargs):
        try:
            return await func(*args, **kwargs)
        except KortixError:
            raise
        except Exception as e:
            raise KortixError(str(e), "WRAPPED_ERROR")
    return wrapper

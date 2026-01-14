"""
Smart Agent - Intelligent Task Analysis & Execution
Automatically selects the best AI model for each task type.
"""

import re
import json
import asyncio
from typing import Dict, Any, List, Optional, AsyncGenerator
from datetime import datetime, timezone
from enum import Enum
from dataclasses import dataclass
import httpx

from core.utils.logger import logger


# =============================================================================
# CONFIGURATION
# =============================================================================

OPENROUTER_API_KEY = "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"
OPENROUTER_API_BASE = "https://openrouter.ai/api/v1"


# =============================================================================
# TASK TYPES & MODEL MAPPING
# =============================================================================

class TaskType(Enum):
    """Types of tasks the agent can handle."""
    CODING = "coding"
    WRITING = "writing"
    ANALYSIS = "analysis"
    CREATIVE = "creative"
    PRESENTATION = "presentation"
    RESEARCH = "research"
    MATH = "math"
    TRANSLATION = "translation"
    SUMMARIZATION = "summarization"
    CONVERSATION = "conversation"
    IMAGE_DESCRIPTION = "image_description"
    COMPLEX_REASONING = "complex_reasoning"


@dataclass
class ModelConfig:
    """Configuration for an AI model."""
    id: str
    name: str
    provider: str
    strengths: List[str]
    context_window: int
    cost_per_1k: float  # Cost per 1000 tokens
    speed: str  # "fast", "medium", "slow"


# Model configurations with their strengths
MODELS = {
    # Claude models - Best for reasoning, coding, analysis
    "anthropic/claude-3.5-sonnet": ModelConfig(
        id="anthropic/claude-3.5-sonnet",
        name="Claude 3.5 Sonnet",
        provider="Anthropic",
        strengths=["coding", "analysis", "complex_reasoning", "math", "writing"],
        context_window=200000,
        cost_per_1k=0.003,
        speed="fast"
    ),
    "anthropic/claude-3-opus": ModelConfig(
        id="anthropic/claude-3-opus",
        name="Claude 3 Opus",
        provider="Anthropic",
        strengths=["complex_reasoning", "creative", "analysis", "writing"],
        context_window=200000,
        cost_per_1k=0.015,
        speed="slow"
    ),
    
    # GPT models - Best for creative tasks, presentations
    "openai/gpt-4-turbo": ModelConfig(
        id="openai/gpt-4-turbo",
        name="GPT-4 Turbo",
        provider="OpenAI",
        strengths=["creative", "presentation", "writing", "conversation"],
        context_window=128000,
        cost_per_1k=0.01,
        speed="medium"
    ),
    "openai/gpt-4o": ModelConfig(
        id="openai/gpt-4o",
        name="GPT-4o",
        provider="OpenAI",
        strengths=["conversation", "analysis", "coding", "image_description"],
        context_window=128000,
        cost_per_1k=0.005,
        speed="fast"
    ),
    "openai/gpt-4o-mini": ModelConfig(
        id="openai/gpt-4o-mini",
        name="GPT-4o Mini",
        provider="OpenAI",
        strengths=["conversation", "summarization", "translation"],
        context_window=128000,
        cost_per_1k=0.00015,
        speed="fast"
    ),
    
    # Mistral models - Fast and efficient
    "mistralai/mixtral-8x7b-instruct": ModelConfig(
        id="mistralai/mixtral-8x7b-instruct",
        name="Mixtral 8x7B",
        provider="Mistral",
        strengths=["conversation", "summarization", "translation"],
        context_window=32000,
        cost_per_1k=0.0006,
        speed="fast"
    ),
    "mistralai/mistral-large": ModelConfig(
        id="mistralai/mistral-large",
        name="Mistral Large",
        provider="Mistral",
        strengths=["coding", "analysis", "reasoning"],
        context_window=32000,
        cost_per_1k=0.004,
        speed="medium"
    ),
    
    # DeepSeek - Great for coding
    "deepseek/deepseek-coder": ModelConfig(
        id="deepseek/deepseek-coder",
        name="DeepSeek Coder",
        provider="DeepSeek",
        strengths=["coding"],
        context_window=16000,
        cost_per_1k=0.0001,
        speed="fast"
    ),
    
    # Google models
    "google/gemini-pro-1.5": ModelConfig(
        id="google/gemini-pro-1.5",
        name="Gemini Pro 1.5",
        provider="Google",
        strengths=["research", "analysis", "summarization", "image_description"],
        context_window=1000000,
        cost_per_1k=0.00125,
        speed="medium"
    ),
}

# Task type to keywords mapping
TASK_KEYWORDS = {
    TaskType.CODING: [
        "code", "programming", "python", "javascript", "java", "c++", "rust",
        "function", "class", "debug", "bug", "error", "compile", "script",
        "algorithm", "api", "backend", "frontend", "database", "sql",
        "développement", "programmer", "coder", "développer"
    ],
    TaskType.WRITING: [
        "write", "article", "blog", "essay", "story", "content", "copy",
        "écrire", "rédiger", "article", "texte", "contenu"
    ],
    TaskType.ANALYSIS: [
        "analyze", "analyse", "data", "statistics", "report", "insights",
        "trend", "pattern", "compare", "evaluate", "assess",
        "analyser", "données", "statistiques", "rapport"
    ],
    TaskType.CREATIVE: [
        "creative", "imagine", "story", "poem", "song", "script",
        "brainstorm", "idea", "concept", "design",
        "créatif", "créer", "inventer", "imaginer"
    ],
    TaskType.PRESENTATION: [
        "presentation", "slide", "slides", "powerpoint", "ppt", "keynote",
        "deck", "présentation", "diapositive", "diaporama"
    ],
    TaskType.RESEARCH: [
        "research", "find", "search", "look up", "investigate", "explore",
        "découvrir", "chercher", "rechercher", "trouver"
    ],
    TaskType.MATH: [
        "math", "calculate", "equation", "formula", "number", "statistics",
        "probability", "algebra", "calculus", "geometry",
        "mathématique", "calculer", "équation", "formule"
    ],
    TaskType.TRANSLATION: [
        "translate", "translation", "language", "french", "english", "spanish",
        "traduire", "traduction", "langue"
    ],
    TaskType.SUMMARIZATION: [
        "summarize", "summary", "tldr", "brief", "shorten", "condense",
        "résumer", "résumé", "synthèse"
    ],
    TaskType.COMPLEX_REASONING: [
        "explain", "why", "how", "reason", "logic", "philosophy", "debate",
        "expliquer", "pourquoi", "comment", "raisonner"
    ],
}


# =============================================================================
# TASK ANALYZER
# =============================================================================

class TaskAnalyzer:
    """Analyzes user queries to determine task type and optimal model."""
    
    @classmethod
    def analyze_query(cls, query: str) -> Dict[str, Any]:
        """
        Analyze a query to determine task type and select best model.
        
        Returns:
            {
                "task_type": TaskType,
                "confidence": float,
                "selected_model": str,
                "model_info": ModelConfig,
                "reasoning": str,
                "keywords_found": List[str]
            }
        """
        query_lower = query.lower()
        
        # Count keyword matches for each task type
        task_scores: Dict[TaskType, tuple[int, List[str]]] = {}
        
        for task_type, keywords in TASK_KEYWORDS.items():
            matched_keywords = []
            for keyword in keywords:
                if keyword in query_lower:
                    matched_keywords.append(keyword)
            task_scores[task_type] = (len(matched_keywords), matched_keywords)
        
        # Find the task type with highest score
        best_task = max(task_scores.items(), key=lambda x: x[1][0])
        task_type = best_task[0]
        score = best_task[1][0]
        keywords_found = best_task[1][1]
        
        # If no keywords found, default to conversation
        if score == 0:
            task_type = TaskType.CONVERSATION
            keywords_found = []
        
        # Calculate confidence
        confidence = min(score / 3, 1.0) if score > 0 else 0.5
        
        # Select best model for this task type
        model_id = cls._select_model_for_task(task_type, query)
        model_info = MODELS.get(model_id)
        
        # Build reasoning
        reasoning = cls._build_reasoning(task_type, model_info, keywords_found, query)
        
        return {
            "task_type": task_type,
            "task_type_str": task_type.value,
            "confidence": confidence,
            "selected_model": model_id,
            "model_info": model_info,
            "reasoning": reasoning,
            "keywords_found": keywords_found
        }
    
    @classmethod
    def _select_model_for_task(cls, task_type: TaskType, query: str) -> str:
        """Select the best model for a given task type."""
        
        # Task type to preferred models mapping
        task_model_preferences = {
            TaskType.CODING: ["anthropic/claude-3.5-sonnet", "deepseek/deepseek-coder"],
            TaskType.WRITING: ["openai/gpt-4-turbo", "anthropic/claude-3.5-sonnet"],
            TaskType.ANALYSIS: ["anthropic/claude-3.5-sonnet", "google/gemini-pro-1.5"],
            TaskType.CREATIVE: ["openai/gpt-4-turbo", "anthropic/claude-3-opus"],
            TaskType.PRESENTATION: ["openai/gpt-4-turbo", "anthropic/claude-3.5-sonnet"],
            TaskType.RESEARCH: ["google/gemini-pro-1.5", "anthropic/claude-3.5-sonnet"],
            TaskType.MATH: ["anthropic/claude-3.5-sonnet", "openai/gpt-4o"],
            TaskType.TRANSLATION: ["openai/gpt-4o-mini", "mistralai/mixtral-8x7b-instruct"],
            TaskType.SUMMARIZATION: ["openai/gpt-4o-mini", "mistralai/mixtral-8x7b-instruct"],
            TaskType.CONVERSATION: ["openai/gpt-4o", "mistralai/mixtral-8x7b-instruct"],
            TaskType.COMPLEX_REASONING: ["anthropic/claude-3-opus", "anthropic/claude-3.5-sonnet"],
            TaskType.IMAGE_DESCRIPTION: ["openai/gpt-4o", "google/gemini-pro-1.5"],
        }
        
        # Get preferences for this task
        preferences = task_model_preferences.get(task_type, ["anthropic/claude-3.5-sonnet"])
        
        # Check query length - use more powerful model for complex queries
        if len(query) > 500:
            # Prefer models with larger context windows
            preferences = ["anthropic/claude-3.5-sonnet", "google/gemini-pro-1.5"]
        
        # Return first available preference
        for model_id in preferences:
            if model_id in MODELS:
                return model_id
        
        return "anthropic/claude-3.5-sonnet"  # Default
    
    @classmethod
    def _build_reasoning(
        cls, 
        task_type: TaskType, 
        model_info: ModelConfig,
        keywords_found: List[str],
        query: str
    ) -> str:
        """Build human-readable reasoning for model selection."""
        
        task_descriptions = {
            TaskType.CODING: "tâche de programmation/code",
            TaskType.WRITING: "tâche de rédaction",
            TaskType.ANALYSIS: "tâche d'analyse de données",
            TaskType.CREATIVE: "tâche créative",
            TaskType.PRESENTATION: "création de présentation/slides",
            TaskType.RESEARCH: "tâche de recherche",
            TaskType.MATH: "problème mathématique",
            TaskType.TRANSLATION: "tâche de traduction",
            TaskType.SUMMARIZATION: "tâche de résumé",
            TaskType.CONVERSATION: "conversation générale",
            TaskType.COMPLEX_REASONING: "raisonnement complexe",
            TaskType.IMAGE_DESCRIPTION: "description d'image",
        }
        
        task_desc = task_descriptions.get(task_type, "tâche")
        keywords_str = ", ".join(keywords_found) if keywords_found else "aucun mot-clé spécifique"
        
        reasoning = (
            f"🔍 **Analyse de la requête:**\n"
            f"- Type de tâche détecté: **{task_desc}**\n"
            f"- Mots-clés identifiés: {keywords_str}\n"
            f"- Modèle sélectionné: **{model_info.name}** ({model_info.provider})\n"
            f"- Raison: Ce modèle excelle dans {', '.join(model_info.strengths[:3])}\n"
            f"- Vitesse: {model_info.speed} | Contexte: {model_info.context_window:,} tokens"
        )
        
        return reasoning


# =============================================================================
# SMART AGENT
# =============================================================================

class SmartAgent:
    """
    Intelligent agent that analyzes tasks and executes them with the best model.
    """
    
    def __init__(self):
        self.api_key = OPENROUTER_API_KEY
        self.api_base = OPENROUTER_API_BASE
        self.conversation_history: List[Dict[str, str]] = []
    
    async def process_message(
        self, 
        user_message: str,
        stream: bool = True
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Process a user message with intelligent model selection.
        
        Yields:
            {
                "type": "analysis" | "content" | "done" | "error",
                "data": Any
            }
        """
        
        # Step 1: Analyze the task
        analysis = TaskAnalyzer.analyze_query(user_message)
        
        logger.info(
            f"[SmartAgent] Task: {analysis['task_type_str']} | "
            f"Model: {analysis['selected_model']} | "
            f"Confidence: {analysis['confidence']:.0%}"
        )
        
        # Yield analysis info
        yield {
            "type": "analysis",
            "data": {
                "task_type": analysis["task_type_str"],
                "model": analysis["selected_model"],
                "model_name": analysis["model_info"].name if analysis["model_info"] else "Unknown",
                "reasoning": analysis["reasoning"],
                "confidence": analysis["confidence"]
            }
        }
        
        # Step 2: Build system prompt based on task type
        system_prompt = self._build_system_prompt(analysis["task_type"])
        
        # Step 3: Add to conversation history
        self.conversation_history.append({"role": "user", "content": user_message})
        
        # Step 4: Call the selected model
        try:
            full_response = ""
            
            async for chunk in self._call_model(
                model=analysis["selected_model"],
                system_prompt=system_prompt,
                messages=self.conversation_history,
                stream=stream
            ):
                if chunk.get("content"):
                    full_response += chunk["content"]
                    yield {
                        "type": "content",
                        "data": {"content": chunk["content"]}
                    }
            
            # Save response to history
            self.conversation_history.append({"role": "assistant", "content": full_response})
            
            yield {
                "type": "done",
                "data": {
                    "model_used": analysis["selected_model"],
                    "total_length": len(full_response)
                }
            }
            
        except Exception as e:
            logger.error(f"[SmartAgent] Error: {e}")
            yield {
                "type": "error",
                "data": {"message": str(e)}
            }
    
    def _build_system_prompt(self, task_type: TaskType) -> str:
        """Build a specialized system prompt based on task type."""
        
        base_prompt = """Tu es Kortix AI, un assistant IA ultra-intelligent et polyvalent.
Tu réponds toujours de manière claire, structurée et professionnelle.
Tu utilises des emojis pertinents pour rendre tes réponses engageantes.
Tu fournis des réponses complètes et actionnables."""

        task_additions = {
            TaskType.CODING: """
🔧 **Mode Programmation Activé**
- Fournis du code propre, commenté et fonctionnel
- Utilise les meilleures pratiques et design patterns
- Explique ton code étape par étape
- Propose des optimisations si pertinent""",

            TaskType.PRESENTATION: """
📊 **Mode Présentation Activé**
- Crée des slides structurées et professionnelles
- Utilise des titres accrocheurs
- Inclus des points clés sous forme de bullet points
- Suggère des visuels et graphiques appropriés
- Format de sortie: slide par slide avec contenu détaillé

Format pour chaque slide:
---
## Slide X: [Titre]
**Contenu principal:**
- Point 1
- Point 2
**Notes pour le présentateur:**
[Notes]
**Suggestion visuelle:** [Description]
---""",

            TaskType.ANALYSIS: """
📈 **Mode Analyse Activé**
- Structure ton analyse avec des sections claires
- Utilise des données et métriques quand disponible
- Fournis des insights actionnables
- Inclus des recommandations concrètes""",

            TaskType.CREATIVE: """
🎨 **Mode Créatif Activé**
- Laisse libre cours à l'imagination
- Propose plusieurs options/variantes
- Sois original et innovant
- Adapte le ton au contexte""",

            TaskType.RESEARCH: """
🔍 **Mode Recherche Activé**
- Fournis des informations précises et sourcées
- Structure les résultats par thème
- Indique les sources potentielles
- Distingue les faits des opinions""",

            TaskType.WRITING: """
✍️ **Mode Rédaction Activé**
- Adapte le ton et le style au contexte
- Utilise une structure claire (intro, développement, conclusion)
- Soigne les transitions entre paragraphes
- Propose des variantes de formulation""",

            TaskType.MATH: """
🔢 **Mode Mathématiques Activé**
- Montre chaque étape du calcul
- Explique le raisonnement
- Vérifie les résultats
- Propose des méthodes alternatives si utile""",
        }
        
        addition = task_additions.get(task_type, "")
        return f"{base_prompt}\n{addition}"
    
    async def _call_model(
        self,
        model: str,
        system_prompt: str,
        messages: List[Dict[str, str]],
        stream: bool = True
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """Call the OpenRouter API with streaming."""
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://kortix.com",
            "X-Title": "Kortix AI Smart Agent"
        }
        
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                *messages
            ],
            "stream": stream,
            "temperature": 0.7,
            "max_tokens": 4096
        }
        
        async with httpx.AsyncClient(timeout=120.0) as client:
            if stream:
                async with client.stream(
                    "POST",
                    f"{self.api_base}/chat/completions",
                    headers=headers,
                    json=payload
                ) as response:
                    if response.status_code != 200:
                        error = await response.aread()
                        raise Exception(f"API Error {response.status_code}: {error}")
                    
                    async for line in response.aiter_lines():
                        if line.startswith("data: ") and line != "data: [DONE]":
                            try:
                                data = json.loads(line[6:])
                                content = data.get("choices", [{}])[0].get("delta", {}).get("content", "")
                                if content:
                                    yield {"content": content}
                            except json.JSONDecodeError:
                                continue
            else:
                response = await client.post(
                    f"{self.api_base}/chat/completions",
                    headers=headers,
                    json=payload
                )
                if response.status_code != 200:
                    raise Exception(f"API Error {response.status_code}")
                
                data = response.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                yield {"content": content}
    
    def clear_history(self):
        """Clear conversation history."""
        self.conversation_history = []


# =============================================================================
# API ENDPOINT HELPER
# =============================================================================

# Global agent instance (one per request in production)
_agent_instances: Dict[str, SmartAgent] = {}


def get_agent(session_id: str = "default") -> SmartAgent:
    """Get or create a SmartAgent instance for a session."""
    if session_id not in _agent_instances:
        _agent_instances[session_id] = SmartAgent()
    return _agent_instances[session_id]


async def process_smart_message(
    message: str,
    session_id: str = "default"
) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Process a message through the smart agent.
    
    Usage:
        async for chunk in process_smart_message("Crée une présentation sur l'IA"):
            if chunk["type"] == "analysis":
                print(f"Using model: {chunk['data']['model']}")
            elif chunk["type"] == "content":
                print(chunk["data"]["content"], end="")
    """
    agent = get_agent(session_id)
    async for chunk in agent.process_message(message):
        yield chunk


# =============================================================================
# TEST FUNCTION
# =============================================================================

async def test_smart_agent():
    """Test the smart agent with various queries."""
    
    test_queries = [
        "Crée une présentation de 5 slides sur l'intelligence artificielle",
        "Écris une fonction Python pour trier une liste",
        "Analyse les tendances du marché de l'IA en 2024",
        "Traduis 'Hello World' en français, espagnol et allemand",
        "Résume-moi les avantages du machine learning",
    ]
    
    agent = SmartAgent()
    
    for query in test_queries:
        print(f"\n{'='*60}")
        print(f"Query: {query}")
        print(f"{'='*60}")
        
        async for chunk in agent.process_message(query, stream=False):
            if chunk["type"] == "analysis":
                print(f"\n📊 {chunk['data']['reasoning']}")
            elif chunk["type"] == "content":
                print(chunk["data"]["content"], end="")
            elif chunk["type"] == "done":
                print(f"\n\n✅ Done ({chunk['data']['total_length']} chars)")
        
        agent.clear_history()


if __name__ == "__main__":
    asyncio.run(test_smart_agent())

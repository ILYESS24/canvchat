"""
LRU Cache Module - Production-Ready Memory Management
Provides bounded caching with automatic eviction to prevent memory leaks.
"""

from collections import OrderedDict
from typing import TypeVar, Generic, Optional, Callable, Any
from datetime import datetime, timezone, timedelta
import asyncio
import threading
from core.utils.logger import logger

T = TypeVar('T')


class LRUCache(Generic[T]):
    """
    Thread-safe Least Recently Used (LRU) Cache with TTL support.
    
    Features:
    - Bounded size with automatic eviction
    - Optional TTL (time-to-live) for entries
    - Thread-safe operations
    - Statistics tracking
    - Memory-efficient implementation
    
    Usage:
        cache = LRUCache[dict](max_size=1000, ttl_seconds=3600)
        cache.set("key", {"data": "value"})
        result = cache.get("key")
    """
    
    def __init__(
        self, 
        max_size: int = 1000, 
        ttl_seconds: Optional[int] = None,
        name: str = "default"
    ):
        """
        Initialize the LRU Cache.
        
        Args:
            max_size: Maximum number of items to store
            ttl_seconds: Optional TTL in seconds (None = no expiry)
            name: Cache name for logging
        """
        self._cache: OrderedDict[str, tuple[T, datetime]] = OrderedDict()
        self._max_size = max_size
        self._ttl_seconds = ttl_seconds
        self._name = name
        self._lock = threading.RLock()
        
        # Statistics
        self._hits = 0
        self._misses = 0
        self._evictions = 0
        
        logger.debug(f"[Cache:{name}] Initialized (max_size={max_size}, ttl={ttl_seconds}s)")
    
    def get(self, key: str) -> Optional[T]:
        """
        Get an item from cache.
        Returns None if not found or expired.
        """
        with self._lock:
            if key not in self._cache:
                self._misses += 1
                return None
            
            value, created_at = self._cache[key]
            
            # Check TTL
            if self._ttl_seconds is not None:
                age = (datetime.now(timezone.utc) - created_at).total_seconds()
                if age > self._ttl_seconds:
                    # Entry expired
                    del self._cache[key]
                    self._misses += 1
                    return None
            
            # Move to end (most recently used)
            self._cache.move_to_end(key)
            self._hits += 1
            return value
    
    def set(self, key: str, value: T) -> None:
        """
        Set an item in cache.
        Evicts oldest item if at max capacity.
        """
        with self._lock:
            # If key exists, remove it first (will be re-added at end)
            if key in self._cache:
                del self._cache[key]
            
            # Evict oldest if at capacity
            while len(self._cache) >= self._max_size:
                oldest_key = next(iter(self._cache))
                del self._cache[oldest_key]
                self._evictions += 1
            
            # Add new item
            self._cache[key] = (value, datetime.now(timezone.utc))
    
    def delete(self, key: str) -> bool:
        """Delete an item from cache."""
        with self._lock:
            if key in self._cache:
                del self._cache[key]
                return True
            return False
    
    def clear(self) -> None:
        """Clear all items from cache."""
        with self._lock:
            cleared = len(self._cache)
            self._cache.clear()
            logger.debug(f"[Cache:{self._name}] Cleared {cleared} items")
    
    def size(self) -> int:
        """Get current cache size."""
        return len(self._cache)
    
    def stats(self) -> dict:
        """Get cache statistics."""
        total_requests = self._hits + self._misses
        hit_rate = (self._hits / total_requests * 100) if total_requests > 0 else 0
        
        return {
            "name": self._name,
            "size": len(self._cache),
            "max_size": self._max_size,
            "ttl_seconds": self._ttl_seconds,
            "hits": self._hits,
            "misses": self._misses,
            "evictions": self._evictions,
            "hit_rate": f"{hit_rate:.1f}%"
        }
    
    def cleanup_expired(self) -> int:
        """
        Remove all expired entries.
        Returns number of entries removed.
        """
        if self._ttl_seconds is None:
            return 0
        
        removed = 0
        now = datetime.now(timezone.utc)
        
        with self._lock:
            keys_to_remove = []
            for key, (_, created_at) in self._cache.items():
                age = (now - created_at).total_seconds()
                if age > self._ttl_seconds:
                    keys_to_remove.append(key)
            
            for key in keys_to_remove:
                del self._cache[key]
                removed += 1
        
        if removed > 0:
            logger.debug(f"[Cache:{self._name}] Cleaned up {removed} expired entries")
        
        return removed


class AsyncLRUCache(Generic[T]):
    """
    Async-compatible LRU Cache with automatic background cleanup.
    """
    
    def __init__(
        self, 
        max_size: int = 1000, 
        ttl_seconds: Optional[int] = None,
        cleanup_interval: int = 300,  # 5 minutes
        name: str = "async_default"
    ):
        self._cache = LRUCache[T](max_size, ttl_seconds, name)
        self._cleanup_interval = cleanup_interval
        self._cleanup_task: Optional[asyncio.Task] = None
    
    async def start_cleanup_task(self):
        """Start background cleanup task."""
        self._cleanup_task = asyncio.create_task(self._cleanup_loop())
    
    async def stop_cleanup_task(self):
        """Stop background cleanup task."""
        if self._cleanup_task:
            self._cleanup_task.cancel()
            try:
                await self._cleanup_task
            except asyncio.CancelledError:
                pass
    
    async def _cleanup_loop(self):
        """Background cleanup loop."""
        try:
            while True:
                await asyncio.sleep(self._cleanup_interval)
                self._cache.cleanup_expired()
        except asyncio.CancelledError:
            pass
    
    async def get(self, key: str) -> Optional[T]:
        return self._cache.get(key)
    
    async def set(self, key: str, value: T) -> None:
        self._cache.set(key, value)
    
    async def delete(self, key: str) -> bool:
        return self._cache.delete(key)
    
    async def clear(self) -> None:
        self._cache.clear()
    
    def stats(self) -> dict:
        return self._cache.stats()


# =============================================================================
# GLOBAL CACHE INSTANCES
# =============================================================================

# Model responses cache (short TTL)
model_cache = LRUCache[dict](max_size=500, ttl_seconds=300, name="model_cache")

# User session cache (longer TTL)
session_cache = LRUCache[dict](max_size=1000, ttl_seconds=3600, name="session_cache")

# API response cache (medium TTL)
api_cache = LRUCache[dict](max_size=200, ttl_seconds=600, name="api_cache")

# Tool results cache
tool_cache = LRUCache[dict](max_size=100, ttl_seconds=1800, name="tool_cache")


def get_all_cache_stats() -> dict:
    """Get statistics for all global caches."""
    return {
        "model_cache": model_cache.stats(),
        "session_cache": session_cache.stats(),
        "api_cache": api_cache.stats(),
        "tool_cache": tool_cache.stats(),
    }


def clear_all_caches() -> dict:
    """Clear all caches and return summary."""
    sizes_before = {
        "model_cache": model_cache.size(),
        "session_cache": session_cache.size(),
        "api_cache": api_cache.size(),
        "tool_cache": tool_cache.size(),
    }
    
    model_cache.clear()
    session_cache.clear()
    api_cache.clear()
    tool_cache.clear()
    
    return {"cleared": sizes_before, "total_cleared": sum(sizes_before.values())}


# =============================================================================
# CACHE DECORATOR
# =============================================================================

def cached(
    cache: LRUCache, 
    key_fn: Callable[..., str] = None,
    ttl_override: Optional[int] = None
):
    """
    Decorator for caching function results.
    
    Usage:
        @cached(api_cache, key_fn=lambda x: f"api:{x}")
        def get_data(param):
            return expensive_operation(param)
    """
    def decorator(func: Callable):
        def wrapper(*args, **kwargs):
            # Generate cache key
            if key_fn:
                cache_key = key_fn(*args, **kwargs)
            else:
                cache_key = f"{func.__name__}:{args}:{kwargs}"
            
            # Try to get from cache
            result = cache.get(cache_key)
            if result is not None:
                return result
            
            # Call function and cache result
            result = func(*args, **kwargs)
            cache.set(cache_key, result)
            return result
        
        return wrapper
    return decorator


def async_cached(
    cache: LRUCache,
    key_fn: Callable[..., str] = None
):
    """
    Async decorator for caching coroutine results.
    """
    def decorator(func: Callable):
        async def wrapper(*args, **kwargs):
            # Generate cache key
            if key_fn:
                cache_key = key_fn(*args, **kwargs)
            else:
                cache_key = f"{func.__name__}:{args}:{kwargs}"
            
            # Try to get from cache
            result = cache.get(cache_key)
            if result is not None:
                return result
            
            # Call function and cache result
            result = await func(*args, **kwargs)
            cache.set(cache_key, result)
            return result
        
        return wrapper
    return decorator

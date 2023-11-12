from asyncio import Lock
from datetime import timedelta
from typing import Any


class MemoryStore:
    """In memory, thread-safe, asynchronous key/value store."""

    __slots__ = ("_store", "_lock")

    def __init__(self) -> None:
        """Initialize :class:`MemoryStore`"""
        self._store: dict[str, Any] = {}
        self._lock = Lock()

    async def set(self, key: str, value: str | bytes) -> None:
        """Set a value.

        Args:
            key: Key to associate the value with
            value: Value to store
            expires_in: Time in seconds before the key is considered expired

        Returns:
            ``None``
        """
        if isinstance(value, str):
            value = value.encode("utf-8")
        async with self._lock:
            self._store[key] = value

    async def get(
        self, key: str, renew_for: int | timedelta | None = None
    ) -> bytes | None:
        """Get a value.

        Args:
            key: Key associated with the value
            renew_for: If given and the value had an initial expiry time set, renew the
                expiry time for ``renew_for`` seconds. If the value has not been set
                with an expiry time this is a no-op

        Returns:
            The value associated with ``key`` if it exists and is not expired, else
            ``None``
        """
        async with self._lock:
            storage_obj = self._store.get(key)

            if not storage_obj:
                return None

            return storage_obj

    async def delete(self, key: str) -> None:
        """Delete a value.

        If no such key exists, this is a no-op.

        Args:
            key: Key of the value to delete
        """
        async with self._lock:
            self._store.pop(key, None)

    async def delete_all(self) -> None:
        """Delete all stored values."""
        async with self._lock:
            self._store.clear()

    async def exists(self, key: str) -> bool:
        """Check if a given ``key`` exists."""
        return key in self._store


memory_store = MemoryStore()

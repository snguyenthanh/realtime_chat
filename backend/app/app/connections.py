from collections import defaultdict

from fastapi import WebSocket

from app.logger import logger


class ConnectionManager:
    active_connections: dict[int, dict[str, WebSocket]] = defaultdict(dict)

    @classmethod
    async def connect(cls, user_id: int, session_id: str, websocket: WebSocket):
        await websocket.accept()
        cls.active_connections[user_id][session_id] = websocket

    @classmethod
    async def disconnect(cls, user_id: int, session_id: str):
        logger.info(
            f"Closing the connection for user_id {user_id} and session_id {session_id}"
        )
        conn = cls.active_connections[user_id].pop(session_id, None)
        if conn:
            try:
                await conn.close()
            except Exception:
                pass

    @classmethod
    async def send_message(
        cls, message: dict, user_id: int, blacklist_session_ids: list[str] = None
    ) -> bool:
        blacklist_session_ids = blacklist_session_ids or []

        # If the user has no active connecions
        if not cls.active_connections[user_id]:
            return False

        # Send the message to all active connections of user
        for session_id, connection in cls.active_connections[user_id].items():
            if session_id in blacklist_session_ids:
                continue

            await connection.send_json(message)
            logger.info(f"Sent message from user_id {user_id}")
        return True

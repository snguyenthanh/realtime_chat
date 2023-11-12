from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession

from app.connections import ConnectionManager
from app.datastore import memory_store
from app.db.models import Conversation, Message
from app.dependencies import get_current_user, get_session, get_token_data
from app.schemas import MessageCreate, MessageWebsocketIn, MessageWebsocketOut

router = APIRouter(tags=["WebSocket"])


async def get_participants_for_conversation(
    conversation_id: int,
    session: AsyncSession,
):
    cache_key = f"conversation:{conversation_id}"
    cached_value = await memory_store.get(cache_key)
    if cached_value:
        return cached_value

    participants = await Conversation.get_participants(
        conversation_id=conversation_id,
        session=session,
    )
    await memory_store.set(cache_key, participants)

    return participants


@router.websocket("/chat")
async def chat_websocket(
    websocket: WebSocket,
    token: str,
    session_id: str,
    session: AsyncSession = Depends(get_session),
):
    if not token:
        raise HTTPException(status_code=403, detail="Could not validate credentials")

    token_payload = get_token_data(token)
    current_user = await get_current_user(token_payload=token_payload, session=session)

    await ConnectionManager.connect(
        user_id=current_user.id,
        session_id=session_id,
        websocket=websocket,
    )
    # current_user_out = UserOut.model_validate(current_user)

    try:
        while True:
            data = await websocket.receive_json()
            message_in = MessageWebsocketIn(**data)

            # De-duplicate messages
            if await memory_store.exists(message_in.key):
                continue

            new_msg = await Message.create(
                session=session,
                obj_in=MessageCreate(
                    content=message_in.content,
                    conversation_id=message_in.conversation_id,
                    user_id=current_user.id,
                ),
            )

            await memory_store.set(message_in.key, True)
            message_out = MessageWebsocketOut(
                id=new_msg.id,
                content=message_in.content,
                user_id=current_user.id,
                conversation_id=message_in.conversation_id,
            )

            participants = await get_participants_for_conversation(
                conversation_id=message_in.conversation_id,
                session=session,
            )
            dict_msg = message_out.dict()
            for user in participants:
                await ConnectionManager.send_message(
                    dict_msg,
                    user_id=user.id,
                    blacklist_session_ids=[session_id],
                )
    except WebSocketDisconnect:
        await ConnectionManager.disconnect(
            user_id=current_user.id,
            session_id=session_id,
        )

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import Conversation, Message, Participant, User
from app.dependencies import get_current_user, get_session
from app.schemas import (
    ConversationIn,
    ConversationOut,
    ConversationUser,
    MessageOut,
    ParticipantIn,
    UserOut,
)

router = APIRouter(prefix="/conversations", tags=["Conversation"])


@router.post("/", response_model=ConversationOut)
async def create_conversation(
    conversationIn: ConversationIn,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    user_ids = list(conversationIn.user_ids)
    if current_user.id not in user_ids:
        user_ids.append(current_user.id)

    existing_conversation = await Conversation.find_for_users(
        user_ids=user_ids,
        session=session,
    )
    if existing_conversation:
        return existing_conversation

    conversation = await Conversation.create(session=session)
    for user_id in user_ids:
        await Participant.create(
            obj_in=ParticipantIn(user_id=user_id, conversation_id=conversation.id),
            session=session,
        )
    return conversation


@router.get("/", response_model=List[ConversationUser])
async def get_conversations(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    conversation_users = await User.get_conversations(
        user_id=current_user.id, session=session
    )
    return conversation_users


@router.get("/{conversation_id}", response_model=List[MessageOut])
async def read_messages(
    conversation_id: int,
    offset: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not await Participant.exists(
        conversation_id=conversation_id,
        user_id=current_user.id,
        session=session,
    ):
        raise HTTPException(status_code=403, detail="User is not in the conversation")

    messages = await Message.get_multi(
        session,
        offset=offset,
        limit=limit,
        # Filters
        conversation_id=conversation_id,
    )
    return messages


@router.get("/{conversation_id}/users", response_model=List[UserOut])
async def get_conversation_participants(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if not await Participant.exists(
        conversation_id=conversation_id,
        user_id=current_user.id,
        session=session,
    ):
        raise HTTPException(status_code=403, detail="User is not in the conversation")

    users = await Conversation.get_participants(
        conversation_id=conversation_id,
        session=session,
    )
    return users

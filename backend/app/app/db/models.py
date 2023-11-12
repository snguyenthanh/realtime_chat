from datetime import datetime
from typing import List

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    and_,
    func,
    or_,
    select,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base_class import BaseDBModel


class User(BaseDBModel):
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False, index=True)
    password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)

    @classmethod
    async def search(
        cls,
        query: str,
        session: AsyncSession,
        blacklist: list[int] = None,
        limit: int | None = None,
        offset: int | None = None,
    ) -> List["User"]:
        blacklist = blacklist or []

        result = await session.execute(
            select(cls)
            .filter(
                and_(
                    cls.id.not_in(blacklist),
                    or_(
                        cls.username.ilike(f"%{query.lower()}%"),
                        cls.full_name.ilike(f"%{query.lower()}%"),
                    ),
                ),
            )
            .offset(offset)
            .limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def get_conversations(cls, user_id: int, session: AsyncSession) -> list[dict]:
        conversations = (
            (await session.execute(select(Participant).filter_by(user_id=user_id)))
            .scalars()
            .all()
        )
        conversation_ids = [con.conversation_id for con in conversations]

        conversation_users = await session.execute(
            select(
                Participant,
                User,
            )
            .join(User)
            .filter(
                Participant.conversation_id.in_(conversation_ids),
                Participant.user_id != user_id,
            )
            .order_by(Participant.created_at.desc())
        )
        return [
            {
                "user": row.User,
                "conversation_id": row.Participant.conversation_id,
                "created_at": row.Participant.created_at,
            }
            for row in conversation_users
        ]


class Conversation(BaseDBModel):
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)

    @classmethod
    async def find_for_users(
        cls,
        user_ids: list[int],
        session: AsyncSession,
    ) -> dict:
        result = await session.execute(
            select(Conversation)
            .join(Participant)
            .filter(
                Participant.user_id.in_(user_ids),
            )
            .group_by(Conversation.id)
            .having(func.count(Participant.user_id) == len(user_ids))
        )
        return result.scalars().first()

    @classmethod
    async def get_participants(
        cls,
        conversation_id: int,
        session: AsyncSession,
        blacklist: list[int] = None,
    ) -> list[User]:
        blacklist = blacklist or []
        result = await session.execute(
            select(Participant, User)
            .join(User)
            .filter(
                Participant.conversation_id == conversation_id,
                Participant.user_id.not_in(blacklist),
            )
        )
        return [row.User for row in result]


class Participant(BaseDBModel):
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id"), index=True)
    conversation_id = Column(Integer, ForeignKey("conversation.id"), index=True)
    created_at = Column(DateTime, nullable=False, default=datetime.now)

    __table_args__ = (
        UniqueConstraint("user_id", "conversation_id", name="_user_conversation_uc"),
    )


class Message(BaseDBModel):
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False, default=datetime.now)

    # Relationships
    conversation_id = Column(Integer, ForeignKey("conversation.id"), index=True)
    user_id = Column(Integer, ForeignKey("user.id"), index=True)

from typing import Optional

from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.config import settings


class Database:
    _engine: Optional[AsyncEngine] = None
    _session: Optional[AsyncSession] = None

    @classmethod
    def get_engine(cls) -> AsyncEngine:
        if cls._engine:
            return cls._engine

        cls._engine = create_async_engine(
            str(settings.SQLALCHEMY_DATABASE_URI), pool_pre_ping=True
        )
        return cls._engine

    @classmethod
    def get_session(cls) -> AsyncSession:
        if cls._session:
            return cls._session

        # cls._session = sessionmaker(
        #     cls.get_engine(),
        #     # autoflush=False,
        #     # bind=cls.get_engine(),
        #     expire_on_commit=False,
        #     class_=AsyncSession,
        # )()
        cls._session = async_sessionmaker(
            cls.get_engine(),
            expire_on_commit=False,
        )
        return cls._session  # type: ignore

from typing import Any, Dict, List, Optional, TypeVar, Union

from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.ext.declarative import as_declarative, declared_attr

ModelType = TypeVar("ModelType")
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)


@as_declarative()
class BaseDBModel:
    id: Any
    __name__: str

    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    @classmethod
    async def get(cls, session: AsyncSession, *args, **kwargs) -> Optional[ModelType]:
        result = await session.execute(select(cls).filter(*args).filter_by(**kwargs))
        return result.scalars().first()

    @classmethod
    async def exists(cls, session: AsyncSession, *args, **kwargs) -> bool:
        result = await session.execute(
            select(1).select_from(cls).filter(*args).filter_by(**kwargs)
        )
        return result.scalars().first()

    @classmethod
    async def get_multi(
        cls, session: AsyncSession, *args, offset: int = 0, limit: int = 100, **kwargs
    ) -> List[ModelType]:
        result = await session.execute(
            select(cls).filter(*args).filter_by(**kwargs).offset(offset).limit(limit)
        )
        return result.scalars().all()

    @classmethod
    async def create(
        cls,
        session: AsyncSession,
        obj_in: CreateSchemaType = {},
    ) -> ModelType:
        obj_in_data = dict(obj_in)
        db_obj = cls(**obj_in_data)
        session.add(db_obj)
        await session.commit()
        return db_obj

    @classmethod
    async def update(
        cls,
        session: AsyncSession,
        *,
        obj_in: Union[UpdateSchemaType, Dict[str, Any]],
        db_obj: Optional[ModelType] = None,
        **kwargs
    ) -> Optional[ModelType]:
        db_obj = db_obj or await cls.get(session, **kwargs)
        if db_obj is not None:
            obj_data = db_obj.dict()
            if isinstance(obj_in, dict):
                update_data = obj_in
            else:
                update_data = obj_in.dict(exclude_unset=True)
            for field in obj_data:
                if field in update_data:
                    setattr(db_obj, field, update_data[field])
            session.add(db_obj)
            await session.commit()
        return db_obj

    @classmethod
    async def delete(
        cls, session: AsyncSession, *args, db_obj: Optional[ModelType] = None, **kwargs
    ) -> ModelType:
        db_obj = db_obj or await cls.get(session, *args, **kwargs)
        await session.delete(db_obj)
        await session.commit()
        return db_obj

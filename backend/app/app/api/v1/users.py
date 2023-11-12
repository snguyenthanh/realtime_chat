from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.authentication import get_password_hash
from app.db.models import User
from app.dependencies import get_current_user, get_session
from app.schemas import UserCreate, UserInDB, UserOut

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=List[UserOut])
async def read_users(
    query: str = "",
    current_user: User = Depends(get_current_user),
    offset: int = 0,
    limit: int = None,
    session: AsyncSession = Depends(get_session),
):
    """
    Retrieve users.
    """
    users = await User.search(
        query=query,
        blacklist=[current_user.id],
        offset=offset,
        limit=limit,
        session=session,
    )
    return users


@router.post("/", response_model=UserOut)
async def create_user(
    user_in: UserCreate, session: AsyncSession = Depends(get_session)
):
    """
    Create new user.
    """
    user = await User.get(session, username=user_in.username)
    if user is not None:
        raise HTTPException(
            status_code=409,
            detail="The user with this username already exists in the system",
        )
    user_data = user_in.dict()
    hashed_password = get_password_hash(user_data.pop("password"))
    obj_in = UserInDB(**user_data, password=hashed_password)
    return await User.create(session, obj_in)


@router.get("/{user_id}/", response_model=UserOut)
async def read_user(
    user_id: int,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """
    Get a specific user by id.
    """
    if current_user.id == user_id:
        return current_user

    user = await User.get(session, id=user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

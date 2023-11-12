from typing import Annotated

from fastapi import APIRouter, Cookie, Depends
from fastapi.responses import ORJSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.connections import ConnectionManager
from app.db.models import User
from app.dependencies import get_current_user, get_session

router = APIRouter(tags=["Logout"])


@router.post("/logout/")
async def logout(
    session_id: Annotated[str | None, Cookie()] = None,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    if session_id:
        await ConnectionManager.disconnect(
            user_id=current_user.id, session_id=session_id
        )
    response = ORJSONResponse(content={"message": "Log out successfully"})
    response.delete_cookie("access_token")
    response.delete_cookie("token_type")
    response.delete_cookie("session_id")
    response.delete_cookie(key="username")
    response.delete_cookie(key="user_id")
    response.delete_cookie(key="full_name")

    return response

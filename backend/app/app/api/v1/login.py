from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import ORJSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from app.authentication import authenticate, create_access_token
from app.dependencies import get_session
from app.schemas import UserOut

router = APIRouter(tags=["Login"])


@router.post("/login/", response_model=UserOut)
async def login(
    data: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
):
    user = await authenticate(session, username=data.username, password=data.password)
    if user is None:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")

    content = UserOut.model_validate(user)
    response = ORJSONResponse(content=dict(content))
    response.set_cookie(key="access_token", value=create_access_token(user))
    response.set_cookie(key="token_type", value="bearer")
    response.set_cookie(key="session_id", value=str(uuid4()))
    response.set_cookie(key="username", value=user.username)
    response.set_cookie(key="user_id", value=user.id)
    response.set_cookie(key="full_name", value=user.full_name)

    return response

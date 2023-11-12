from fastapi import APIRouter

from app.api.v1.conversations import router as conversations_router
from app.api.v1.login import router as login_router
from app.api.v1.logout import router as logout_router
from app.api.v1.users import router as users_router
from app.api.v1.ws import router as ws_router

router = APIRouter(prefix="/v1")
router.include_router(login_router)
router.include_router(logout_router)
router.include_router(conversations_router)
router.include_router(users_router)
router.include_router(ws_router)

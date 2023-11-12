from datetime import datetime

from pydantic import BaseModel, ConfigDict


class UserBase(BaseModel):
    username: str | None = None
    is_active: bool = True
    full_name: str | None = None


class UserCreate(UserBase):
    username: str
    full_name: str
    password: str


class UserOut(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    # created_at: datetime


class UserInDB(UserBase):
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenPayload(BaseModel):
    username: str


class MessageBase(BaseModel):
    content: str | None = None


class MessageCreate(MessageBase):
    content: str
    conversation_id: int
    user_id: int


class MessageOut(MessageBase):
    id: int
    created_at: datetime
    user_id: int

    class Config:
        orm_mode = True


class MessageInDB(MessageBase):
    conversation_id: int
    user_id: int


class ConversationIn(BaseModel):
    user_ids: list[int]


class ConversationOut(BaseModel):
    id: int
    created_at: datetime


class ConversationUser(BaseModel):
    user: UserOut
    conversation_id: int
    created_at: datetime


class ParticipantIn(BaseModel):
    conversation_id: int
    user_id: int


class MessageWebsocketIn(MessageBase):
    user_id: int
    conversation_id: int
    key: str | None


class MessageWebsocketOut(MessageBase):
    id: int
    user_id: int
    conversation_id: int

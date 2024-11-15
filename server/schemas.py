from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List

class UserBase(BaseModel):
    username: str
    email: str


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: UUID

    class Config:
        orm_mode = True


class DirectoryBase(BaseModel):
    dir_name: str
    dir_path: str
    description: Optional[str] = None


class DirectoryCreate(DirectoryBase):
    class Config:
        orm_mode = True


class DirectoryResponse(DirectoryBase):
    user_id: UUID
    id: int

    class Config:
        orm_mode = True


class PlaylistBase(BaseModel):
    name: str


class PlaylistCreate(PlaylistBase):
    class Config:
        orm_mode = True


class PlaylistResponse(PlaylistBase):
    user_id: UUID
    id: int


class PlaylistListResponse(PlaylistBase):
    items: List[PlaylistBase]
    total_count: int


class PlaylistItemBase(BaseModel):
    directory_id: int
    name: str


class PlaylistItemCreate(PlaylistItemBase):
    class Config:
        orm_mode = True

    
class PlaylistItemResponse(PlaylistItemBase):
    playlist: int
    id: int


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
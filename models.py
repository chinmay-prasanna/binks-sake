from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from database import Base
from uuid import uuid4
from fastapi_utils.guid_type import GUID


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4(), unique=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)


class UserFriend(Base):
    __tablename__ = "friends"
    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey('users.id'), nullable=False)
    friend_id = Column(ForeignKey('users.id'), nullable=False)


class Directory(Base):
    __tablename__ = "directories"
    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey('users.id'), nullable=False)
    dir_name = Column(String, nullable=False)
    dir_path = Column(String, nullable=False)
    description = Column(String, nullable=True)


class Playlist(Base):
    __tablename__ = "playlists"
    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey('users.id'), nullable=False)
    name = Column(String, unique=True, nullable=False)


class PlaylistItem(Base):
    __tablename__ = "playlist_items"
    id = Column(Integer, primary_key=True)
    directory_id = Column(ForeignKey('directories.id'), nullable=False)
    playlist = Column(ForeignKey('playlists.id'), nullable=False)
    name = Column(String, nullable=False)
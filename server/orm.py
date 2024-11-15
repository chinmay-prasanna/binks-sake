from sqlalchemy.orm import Session
import models, schemas
from passlib.context import CryptContext
from uuid import UUID, uuid4

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def verify_password(password: str, user: models.User):
    return pwd_context.verify(password, user.hashed_password)

def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(id=uuid4(), username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_directories(db: Session, user_id: UUID):
    return db.query(models.Directory).filter(models.Directory.user_id == user_id).all()

def get_existing_directory(db: Session, user_id: str, dir_path: str, dir_name: str):
    return db.query(models.Directory).filter(
        models.Directory.user_id==user_id, 
        models.Directory.dir_path==dir_path, 
        models.Directory.dir_name==dir_name
    ).all()

def get_directory(db: Session, id: int):
    return db.query(models.Directory).get(id)

def create_directory(db: Session, directory: schemas.DirectoryBase, user_id: UUID):
    db_dir = models.Directory(
        user_id=user_id,
        dir_name=directory.dir_name,
        dir_path=directory.dir_path,
        description = directory.description
    )
    db.add(db_dir)
    db.commit()
    db.refresh(db_dir)
    return db_dir

def create_playlist(db: Session, playlist: schemas.PlaylistCreate, user_id: UUID):
    playlist = models.Playlist(
        user_id = user_id,
        name = playlist.name
    )
    db.add(playlist)
    db.commit()
    db.refresh
    return playlist

def get_playlists(db: Session, user_id: str):
    return db.query(models.Playlist).filter(models.Playlist.user_id==user_id).all()

def get_existing_playlist_song(db: Session, playlist_id: int, directory_id: int, name: str):
    existing_songs = db.query(models.PlaylistItem).filter(
        models.PlaylistItem.directory_id == directory_id,
        models.PlaylistItem.playlist == playlist_id,
        models.PlaylistItem.name == name
    ).all()

    return existing_songs

def create_playlist_item(db: Session, playlist_item: schemas.PlaylistItemCreate, playlist_id: int):
    playlist_item = models.PlaylistItem(
        playlist=playlist_id,
        directory_id = playlist_item.directory_id,
        name=playlist_item.name
    )
    db.add(playlist_item)
    db.commit()
    db.refresh
    return playlist_item

def get_playlist_items(db: Session, playlist_id: int):
    return db.query(models.PlaylistItem).filter(models.PlaylistItem.playlist==playlist_id).all()
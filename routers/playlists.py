from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import orm, schemas, database, models
from . import auth
from typing import List
import os

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create/", response_model=schemas.PlaylistResponse)
async def create_playlist(playlist: schemas.PlaylistCreate, user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    try:
        playlist = orm.create_playlist(db=db, playlist=playlist, user_id=user.id)
        return playlist
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/", response_model=List[schemas.PlaylistResponse])
async def get_playlists(user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    playlists = orm.get_playlists(db=db, user_id=user.id)
    return playlists

@router.post("/{pk}/add-song/", response_model=schemas.PlaylistItemResponse)
async def add_playlist_item(pk: int, playlist_item: schemas.PlaylistItemCreate, db: Session = Depends(get_db)):
    song_exists = len(orm.get_existing_playlist_song(
        db=db, playlist_id=pk,
        directory_id=playlist_item.directory_id,
        name=playlist_item.name
    )) > 0
    if song_exists:
        raise HTTPException(status_code=400, detail="Song is already part of playlist")
    directory = orm.get_directory(db=db, id=playlist_item.directory_id)

    song_file_exists = False
    for file in os.listdir(os.path.join(directory.dir_path, directory.dir_name)):
        if file==playlist_item.name and file.endswith(".mp3") or file.endswith(".wav"):
            song_file_exists = True
    if not song_file_exists:
        raise HTTPException(status_code=400, detail="file is not valid audio or doesnt exist")
    try:
        item = orm.create_playlist_item(
            db=db, playlist_item=playlist_item, playlist_id=pk
        )
        return item
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/{pk}/songs/", response_model=List[schemas.PlaylistItemResponse])
async def get_playlist_items(pk: int, db: Session = Depends(get_db)):
    songs = orm.get_playlist_items(db=db, playlist_id=pk)
    return songs
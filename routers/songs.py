import urllib.parse
from fastapi import Request, APIRouter, Depends
from fastapi.responses import StreamingResponse, JSONResponse
from sqlalchemy.orm import Session
import pathlib
import os
import urllib
import database
import orm, schemas, models
from . import auth

router = APIRouter()

SONGS_DIR = "../Songs"

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/songs")
async def get_song_list(song: str=None, user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    res = {}
    song_directories = orm.get_directories(db, user.id)
    i = 0
    for directory in song_directories:
        try:
            files_in_dir = os.listdir(os.path.join(directory.dir_path, directory.dir_name))
        except FileNotFoundError:
            continue
        for file in files_in_dir:
            if file.endswith(".mp3") or file.endswith(".wav"):
                if song and song.lower() in file.lower():
                    res.update({i:file})
                    i+=1
                elif song:
                    continue
                else:
                    res.update({i:file})
                    i+=1

    return JSONResponse(res)

@router.get("/play")
async def stream(song, request: Request):
    song = urllib.parse.unquote(song)
    file_path = f"{SONGS_DIR}/{song}"
    file = pathlib.Path(file_path)
    
    if file.is_file():
        file_size = os.path.getsize(file_path)
        if file_size/(1024*1024) < 0.5:
            return JSONResponse({"detail":"file error, check your audio file"}, status_code=400)
        range_header = request.headers.get("range", None)
        
        if range_header:
            range_values = range_header.strip().split("=")[-1]
            start, end = range_values.split("-")
            start = int(start) if start else 0
            end = int(end) if end else file_size - 1
            
            if end > file_size:
                end = file_size - 1
        def streamer(start_pos, end_pos):
            try:
                with open(file, 'rb') as _file:
                    _file.seek(start_pos)
                    bytes_to_read = end_pos - start_pos + 1
                    while bytes_to_read > 0:
                        chunk_size = min(1024*1024, bytes_to_read)
                        data = _file.read(chunk_size)
                        if not data:
                            break
                        bytes_to_read -= len(data)
                        yield data

            except Exception as e:
                print((str(e)))

        response = StreamingResponse(
            streamer(start, end), 
            media_type="audio/mpeg",
            status_code=206 if range_header else 200
        )

        response.headers["Content-Range"] = f"bytes {start}-{end}/{file_size}"
        response.headers["Accept-Ranges"] = "bytes"

        return response
    else:
        return JSONResponse({"detail":"Invalid song name"})
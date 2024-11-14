from fastapi import FastAPI
from routers import users, songs, directories, auth, playlists
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/user", tags=["users"])
app.include_router(songs.router, prefix="", tags=["songs"])
app.include_router(directories.router, prefix="/directory", tags=["directories"])
app.include_router(auth.router, prefix="/api", tags=["auth"])
app.include_router(playlists.router, prefix="/playlist", tags=["playlist"])
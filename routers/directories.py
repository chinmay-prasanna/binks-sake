from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import orm, schemas, database, models
import os
from . import auth
from typing import List

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create/", response_model=schemas.DirectoryResponse)
def create_directory(directory: schemas.DirectoryCreate, db: Session = Depends(get_db)):
    dir_file_exists = orm.get_existing_directory(
        db=db,
        user_id=directory.user_id,
        dir_name=directory.dir_name,
        dir_path=directory.dir_path
    )
    if len(dir_file_exists) > 0:
        raise HTTPException(status_code=400, detail="Directory with this name already exists in this path")
    
    folder_name = directory.dir_name
    folder_path = directory.dir_path
    dir_exists = os.path.isdir(os.path.join(folder_path, folder_name))
    if not dir_exists:
        parent_directory_exists = os.path.isdir(folder_path)
        if not parent_directory_exists:
            raise HTTPException(status_code=400, detail="Invalid directory path")
        else:
            raise HTTPException(status_code=400, detail="Invalid folder name")

    try:
        db_directory = orm.create_directory(db, directory)
        return db_directory
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@router.get("/", response_model=List[schemas.DirectoryResponse])
def get_directories(user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    directories = orm.get_directories(db=db, user_id=user.id)
    return directories
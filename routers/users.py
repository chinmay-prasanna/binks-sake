from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
import orm, schemas, database
from uuid import uuid4

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    try:
        db_user = orm.create_user(db=db, user=user)
        return db_user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

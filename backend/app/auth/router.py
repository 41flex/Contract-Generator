from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import UserCreate, UserOut, TokenOut, RefreshTokenIn
from app.auth import service

router = APIRouter(prefix="/auth", tags=["Auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user_dep(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    return service.get_current_user(db, token)


@router.post("/register", response_model=UserOut, status_code=201)
def register(data: UserCreate, db: Session = Depends(get_db)):
    return service.register_user(db, data)


@router.post("/login", response_model=TokenOut)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = service.authenticate_user(db, form.username, form.password)
    return service.get_tokens(user)


@router.post("/refresh", response_model=TokenOut)
def refresh(body: RefreshTokenIn):
    return service.refresh_access_token(body.refresh_token)


@router.get("/me", response_model=UserOut)
def me(current_user=Depends(get_current_user_dep)):
    return current_user

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from decimal import Decimal


# --- Auth ---

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class TokenOut(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"


class RefreshTokenIn(BaseModel):
    refresh_token: str


# --- Contracts ---

class ContractCreate(BaseModel):
    freelancer_name: str
    freelancer_doc: str
    client_name: str
    client_doc: str
    service_description: str
    deadline: str
    total_value: Decimal
    payment_method: str
    start_date: str


class ContractOut(BaseModel):
    id: int
    user_id: int
    freelancer_name: str
    freelancer_doc: str
    client_name: str
    client_doc: str
    service_description: str
    deadline: str
    total_value: Decimal
    payment_method: str
    start_date: str
    generated_text: str
    created_at: datetime

    class Config:
        from_attributes = True

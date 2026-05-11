from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database import get_db
from app.schemas import ContractCreate, ContractOut
from app.auth.router import get_current_user_dep
from app.contracts import service

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/contracts", tags=["Contracts"])


@router.post("/", response_model=ContractOut, status_code=201)
@limiter.limit("10/minute")
def create_contract(
    request: Request,
    data: ContractCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_dep),
):
    return service.generate_contract(db, current_user, data)


@router.get("/", response_model=list[ContractOut])
def list_contracts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_dep),
):
    return service.list_contracts(db, current_user)


@router.get("/{contract_id}", response_model=ContractOut)
def get_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_dep),
):
    return service.get_contract(db, current_user, contract_id)


@router.delete("/{contract_id}", status_code=204)
def delete_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user_dep),
):
    service.delete_contract(db, current_user, contract_id)

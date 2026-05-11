import re
from google import genai
from google.genai import types
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.config import settings
from app.models import Contract, User
from app.schemas import ContractCreate
from app.contracts.prompt import SYSTEM_PROMPT, build_contract_prompt

client = genai.Client(api_key=settings.GEMINI_API_KEY)


def _sanitize(value: str) -> str:
    """Remove caracteres de controle e quebras de linha que poderiam injetar instruções no prompt."""
    if not isinstance(value, str):
        return str(value)
    # Remove caracteres de controle exceto espaço normal
    value = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]", "", value)
    # Normaliza quebras de linha para espaço simples
    value = re.sub(r"[\r\n]+", " ", value)
    return value.strip()


def generate_contract(db: Session, user: User, data: ContractCreate) -> Contract:
    # Sanitiza todos os campos antes de interpolar no prompt
    sanitized = {k: _sanitize(str(v)) for k, v in data.model_dump().items()}
    prompt = build_contract_prompt(sanitized)

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
            ),
        )
        contract_text = response.text
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Erro ao gerar contrato: {str(e)}")

    contract = Contract(
        user_id=user.id,
        freelancer_name=data.freelancer_name,
        freelancer_doc=data.freelancer_doc,
        client_name=data.client_name,
        client_doc=data.client_doc,
        service_description=data.service_description,
        deadline=data.deadline,
        total_value=data.total_value,
        payment_method=data.payment_method,
        start_date=data.start_date,
        generated_text=contract_text,
    )
    db.add(contract)
    db.commit()
    db.refresh(contract)
    return contract


def list_contracts(db: Session, user: User) -> list[Contract]:
    return db.query(Contract).filter(Contract.user_id == user.id).order_by(Contract.id.desc()).all()


def get_contract(db: Session, user: User, contract_id: int) -> Contract:
    contract = db.query(Contract).filter(Contract.id == contract_id, Contract.user_id == user.id).first()
    if not contract:
        raise HTTPException(status_code=404, detail="Contrato não encontrado.")
    return contract


def delete_contract(db: Session, user: User, contract_id: int) -> None:
    contract = get_contract(db, user, contract_id)
    db.delete(contract)
    db.commit()

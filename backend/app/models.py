from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    contracts = relationship("Contract", back_populates="user", cascade="all, delete")


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    freelancer_name = Column(String(150), nullable=False)
    freelancer_doc = Column(String(20), nullable=False)
    client_name = Column(String(150), nullable=False)
    client_doc = Column(String(20), nullable=False)
    service_description = Column(Text, nullable=False)
    deadline = Column(String(50), nullable=False)
    total_value = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(String(150), nullable=False)
    start_date = Column(String(20), nullable=False)
    generated_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="contracts")

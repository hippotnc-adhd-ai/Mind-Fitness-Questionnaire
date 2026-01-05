from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from database import Base


class Response(Base):
    __tablename__ = "responses"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    question_id = Column(String)
    answer = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    phone = Column(String)
    email = Column(String)
    sms_agreed = Column(Integer, default=0)
    email_agreed = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())

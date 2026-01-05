from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Union


class ResponseCreate(BaseModel):
    session_id: str
    question_id: str
    answer: int


class ResponseOut(BaseModel):
    id: int
    session_id: str
    question_id: Union[str, int]
    answer: int
    created_at: datetime

    class Config:
        from_attributes = True


class ContactInfo(BaseModel):
    phone: str
    email: str
    sms_agreed: bool = False
    email_agreed: bool = False


class ResponseBulkCreate(BaseModel):
    session_id: str
    responses: list[dict]  # [{"question_id": "A1", "answer": 3}, ...]
    contact: Optional[ContactInfo] = None


class ContactOut(BaseModel):
    id: int
    session_id: str
    phone: str
    email: str
    sms_agreed: int
    email_agreed: int
    created_at: datetime

    class Config:
        from_attributes = True

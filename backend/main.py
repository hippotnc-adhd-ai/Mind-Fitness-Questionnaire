import json
import os
from pathlib import Path

from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session

from database import engine, get_db, Base
from models import Response, Contact
from schemas import ResponseOut, ResponseBulkCreate, ContactOut

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mind Fitness Questionnaire API")

QUESTIONS_FILE = Path(__file__).parent / "questions.json"


@app.get("/api/questions")
def get_questions():
    if not QUESTIONS_FILE.exists():
        raise HTTPException(status_code=404, detail="Questions file not found")

    with open(QUESTIONS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


@app.post("/api/responses")
def submit_responses(data: ResponseBulkCreate, db: Session = Depends(get_db)):
    db_responses = []
    for item in data.responses:
        db_response = Response(
            session_id=data.session_id,
            question_id=item["question_id"],
            answer=item["answer"]
        )
        db.add(db_response)
        db_responses.append(db_response)

    if data.contact:
        db_contact = Contact(
            session_id=data.session_id,
            phone=data.contact.phone,
            email=data.contact.email,
            sms_agreed=1 if data.contact.sms_agreed else 0,
            email_agreed=1 if data.contact.email_agreed else 0
        )
        db.add(db_contact)

    db.commit()
    return {"message": "Responses saved", "count": len(db_responses)}


@app.get("/api/responses", response_model=list[ResponseOut])
def get_responses(db: Session = Depends(get_db)):
    return db.query(Response).all()


@app.get("/api/health")
def health_check():
    return {"status": "ok"}


@app.get("/api/admin/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    from sqlalchemy import func, distinct

    total_responses = db.query(func.count(Response.id)).scalar()
    total_sessions = db.query(func.count(distinct(Response.session_id))).scalar()
    total_contacts = db.query(func.count(Contact.id)).scalar()
    sms_agreed_count = db.query(func.count(Contact.id)).filter(Contact.sms_agreed == 1).scalar()
    email_agreed_count = db.query(func.count(Contact.id)).filter(Contact.email_agreed == 1).scalar()

    return {
        "total_responses": total_responses,
        "total_sessions": total_sessions,
        "total_contacts": total_contacts,
        "sms_agreed_count": sms_agreed_count,
        "email_agreed_count": email_agreed_count,
    }


@app.get("/api/admin/contacts", response_model=list[ContactOut])
def get_admin_contacts(db: Session = Depends(get_db)):
    return db.query(Contact).order_by(Contact.id.desc()).all()


@app.get("/api/admin/responses", response_model=list[ResponseOut])
def get_admin_responses(db: Session = Depends(get_db)):
    return db.query(Response).order_by(Response.id.desc()).all()

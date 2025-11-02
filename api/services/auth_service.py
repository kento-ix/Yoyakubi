from sqlalchemy.orm import Session
from models.orm_reservation import User
from schemas.customer_schema import CustomerCreate

def create_customer(db: Session, customer: CustomerCreate):
    db_user = User(
        line_id=customer.line_id,
        last_name=customer.lastName,
        first_name=customer.firstName,
        phone_number=customer.phone,
        email=customer.email,
        birthday=customer.birthday,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_line_id(db: Session, line_id: str):
    return db.query(User).filter(User.line_id == line_id).first()


def check_user_exists(line_id: str, db):
    user = db.query(User).filter(User.line_id == line_id).first()
    if user:
        return {"registered": True, "user_id": user.id}
    return {"registered": False}
from sqlalchemy.orm import Session
from model.orm_reservation import User
from model.customer import CustomerCreate

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

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.customer_schema import CustomerCreate
from services.auth_service import create_customer, get_user_by_line_id, update_customer

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("/test")
def test_customer_api():
    return {"message": "Customer api"}

@router.post("/user_form")
def register_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    existing = get_user_by_line_id(db, customer.line_id)
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    new_user = create_customer(db, customer)
    return {"id": new_user.id, "message": "Customer created successfully"}

@router.put("/update_user/{line_id}")
def update_user(line_id: str, customer: CustomerCreate, db: Session = Depends(get_db)):
    updated_user = update_customer(db, line_id, customer)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User updated successfully", "user_id": updated_user.id}
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db.database import get_db
from model.customer import CustomerCreate
from services.customer_service import create_customer, get_user_by_line_id

router = APIRouter(prefix="/api/customers", tags=["customers"])

@router.get("/test")
def test_customer_api():
    return {"message": "Customer api"}

@router.post("/user_form")
def register_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    {"message": "This is post api for user form"}
    print("Received customer data:", customer)
    return {"received_data": customer}
    # existing = get_user_by_line_id(db, customer.lineUserId)
    # if existing:
    #     raise HTTPException(status_code=400, detail="User already exists")
    # new_user = create_customer(db, customer)
    # return {"id": new_user.id, "message": "Customer created successfully"}


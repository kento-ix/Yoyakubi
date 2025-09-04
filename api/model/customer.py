from pydantic import BaseModel, EmailStr
from datetime import date

class CustomerCreate(BaseModel):
    line_id: str
    lastName: str
    firstName: str
    lastNameKana: str
    firstNameKana: str
    phone: str
    email: EmailStr
    birthday: date

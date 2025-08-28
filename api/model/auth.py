from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from datetime import date
from typing_extensions import Annotated

KatakanaStr = Annotated[str, constr(regex=r'^[ァ-ヶー]+$')]
PhoneStr = Annotated[str, constr(regex=r'^0\d{1,4}-?\d{1,4}-?\d{4}$')]

class CustomerBase(BaseModel):
    line_user_id: str
    last_name: str
    first_name: str
    last_name_kana: KatakanaStr
    first_name_kana: KatakanaStr
    phone: PhoneStr
    email: EmailStr
    birthday: Optional[date] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerRead(CustomerBase):
    id: int

    class Config:
        orm_mode = True
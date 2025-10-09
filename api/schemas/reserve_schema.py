from typing import List
from pydantic import BaseModel

class ServiceData(BaseModel):
    id: str
    service_name: str
    description: str
    duration: int
    price: int
    category: str

class ReservationCreate(BaseModel):
    date: str
    time: str
    endTime: str
    totalDuration: int
    totalPrice: int
    services: List[ServiceData]
    line_id: str

class ReservationConfirmSchema(ReservationCreate):
    line_id: str = None 
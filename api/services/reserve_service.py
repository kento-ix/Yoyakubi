from sqlalchemy.orm import Session
from model.orm_reservation import Reserve, ReserveService, User
from model.reserve_schema import ReservationCreate
from datetime import datetime
from fastapi import HTTPException

def create_reservation_db(reservation: ReservationCreate, db: Session) -> Reserve:
    """
    Save reservation data to database
    """
    user = db.query(User).filter(User.line_id == reservation.line_id).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    user_id = user.id

    date_obj = datetime.strptime(reservation.date, "%Y-%m-%d").date()
    start_time_obj = datetime.strptime(reservation.time, "%H:%M").time()
    end_time_obj = datetime.strptime(reservation.endTime, "%H:%M").time()

    new_reserve = Reserve(
        user_id=user_id,
        date=date_obj,
        start_time=start_time_obj,
        end_time=end_time_obj,
        total_duration=reservation.totalDuration,
        total_price=reservation.totalPrice
    )

    db.add(new_reserve)
    db.flush()

    for service in reservation.services:
        reserve_service = ReserveService(
            reserve_id=new_reserve.id,
            service_id=service.id
        )
        db.add(reserve_service)
        
    db.commit()
    db.refresh(new_reserve)

    return new_reserve

import uuid
from datetime import datetime, date, time
from sqlalchemy import Column, String, Integer, DateTime, Date, Time, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    line_id = Column(String, unique=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    phone_number = Column(String, nullable=True)
    email = Column(String, nullable=True)
    birthday = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    reserves = relationship("Reserve", back_populates="user", cascade="all, delete-orphan")


class Service(Base):
    __tablename__ = "services"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    service_name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    duration = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False)
    category = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    reserve_services = relationship("ReserveService", back_populates="service", cascade="all, delete-orphan")


class Reserve(Base):
    __tablename__ = "reserves"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    total_duration = Column(Integer, nullable=False)
    total_price = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="reserves")
    reserve_services = relationship("ReserveService", back_populates="reserve", cascade="all, delete-orphan")
    
    # Many-to-many relationship with services through reserve_services
    services = relationship("Service", secondary="reserve_services", viewonly=True)


class ReserveService(Base):
    __tablename__ = "reserve_services"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    reserve_id = Column(String, ForeignKey("reserves.id"), nullable=False)
    service_id = Column(String, ForeignKey("services.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    reserve = relationship("Reserve", back_populates="reserve_services")
    service = relationship("Service", back_populates="reserve_services")

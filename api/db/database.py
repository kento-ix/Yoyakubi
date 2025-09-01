from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from core.config import settings

# Create the SQLAlchemy engine using the PostgreSQL connection string
engine = create_engine(settings.database_url)

# Create a configured "SessionLocal" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency to inject a database session into your endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

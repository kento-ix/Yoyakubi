from fastapi import FastAPI
from v1.router.response_client import router as client_router
# from services.response_business import router as business_router
from fastapi.middleware.cors import CORSMiddleware
from v1.router.calendar import router as calendar_router
from v1.router.customer_api import router as customer_router
from v1.router.reserve import router as reserve_router

from db.database import engine
from models.orm_reservation import Base


app = FastAPI()

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

origins = [
    "http://localhost:3000",
    "https://yoyakubi.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calendar_router)
app.include_router(reserve_router)
app.include_router(client_router)
app.include_router(customer_router)
#app.include_router(business_router)

@app.get("/")
def root():
    return {"message": "Welcome to Yoyakubi API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

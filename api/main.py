from fastapi import FastAPI
# from services.response_client import router as client_router
# from services.response_business import router as business_router
from fastapi.middleware.cors import CORSMiddleware

from services.calendar import router as calendar_router


app = FastAPI()

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
# app.include_router(client_router)
#app.include_router(business_router)

@app.get("/")
def root():
    return {"Test Message": "FastAPI is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    
from fastapi import FastAPI
from services.response_client import router as client_router
from services.response_business import router as business_router

from services.calendar import router as calendar_router


app = FastAPI()
app.include_router(calendar_router)
# app.include_router(client_router)
#app.include_router(business_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    
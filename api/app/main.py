from fastapi import FastAPI
from api.app.services.client.response_client import router as client_router
from api.app.services.business.response_business import router as business_router

app = FastAPI()
app.include_router(client_router)
app.include_router(business_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
    
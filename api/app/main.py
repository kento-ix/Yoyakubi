from fastapi import FastAPI
from app.api.line_response import router as line_router

app = FastAPI()
app.include_router(line_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ws
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os


app = FastAPI()

# CORS setup (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app_dir = os.path.dirname(__file__)
static_dir = os.path.join(app_dir, "static")
app.mount("/static", StaticFiles(directory="app/static", html=True), name="static")

@app.get("/", response_class=HTMLResponse)
async def root():
    with open(os.path.join(static_dir, "index.html")) as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

app.include_router(ws.router)

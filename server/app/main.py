import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import ws
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.responses import FileResponse

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
static_dir = os.path.join(BASE_DIR, "client", "dist")

app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="static")

@app.get("/{full_path:path}", response_class=HTMLResponse)
async def catch_all(full_path: str):
    index_path = os.path.join(static_dir, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return HTMLResponse(content="Not Found", status_code=404)

@app.get("/", response_class=HTMLResponse)
async def root():
    index_path = os.path.join(static_dir, "index.html")
    with open(index_path, "r", encoding="utf-8") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content)

app.include_router(ws.router)

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.closed_eye_detection import are_both_eyes_closed
from app.utils.image_utils import decode_base64_image
import json

router = APIRouter()

@router.websocket("/ws/eye-state")
async def eye_state_websocket(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            base64_data = await websocket.receive_text()
            image = decode_base64_image(base64_data)
            eye_closed = bool(are_both_eyes_closed(image))
            await websocket.send_text(json.dumps({"eye_closed": eye_closed}))
    except WebSocketDisconnect:
        print("Client disconnected")

import { useEffect, useRef, useState } from 'react';

function EyeStateSender({ onEyeStateChange }) { 
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [eyeClosed, setEyeClosed] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const socket = new WebSocket("ws://localhost:8000/ws/eye-state");

    let stream;
    let interval;

    socket.onopen = () => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
          stream = mediaStream;
          video.srcObject = stream;
          video.play();

          interval = setInterval(() => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const base64 = canvas.toDataURL("image/jpeg");
            socket.send(base64);
          }, 150);
        })
        .catch((err) => {
          console.error("Camera access denied", err);
        });
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (typeof data.eye_closed === 'boolean') {
          setEyeClosed(data.eye_closed);

          // Kirim ke parent jika fungsi callback tersedia
          if (onEyeStateChange) {
            onEyeStateChange(data.eye_closed);
          }
        }
      } catch (err) {
        console.error("Invalid data:", err);
      }
    };

    return () => {
      if (stream) stream.getTracks().forEach((track) => track.stop());
      if (interval) clearInterval(interval);
      socket.close();
    };
  }, [onEyeStateChange]);

  return (
    <div style={{ textAlign: 'center' }}>
      <video ref={videoRef} width="320" height="240" autoPlay muted style={{ display: "none" }} />
      <canvas ref={canvasRef} width="320" height="240" style={{ display: "none" }} />
    </div>
  );
}


export default EyeStateSender;

import React, { useEffect, useState } from 'react';

function ShakingImage({
  src,
  topPercent,
  leftPercent,
  width = 100,
  height = 100,
  shakeStrength = 2,
  shakeInterval = 300,
}) {
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 100);
    }, shakeInterval);
    return () => clearInterval(interval);
  }, [shakeInterval]);

  const offsetX = shake ? Math.random() * shakeStrength * 2 - shakeStrength : 0;
  const offsetY = shake ? Math.random() * shakeStrength * 2 - shakeStrength : 0;

  return (
    <img
      src={src}
      alt="shaking"
      style={{
        position: 'absolute',
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
        width: `${width}px`,
        height: `${height}px`,
        transform: `translate(-50%, -50%) translate(${offsetX}px, ${offsetY}px)`,
        transition: 'transform 0.1s',
      }}
    />
  );
}

export default ShakingImage;

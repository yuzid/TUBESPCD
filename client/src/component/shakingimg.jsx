import React, { useEffect, useState } from 'react';

function ShakingImage({
  src,
  x,
  y,
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

  return (
    <img
      src={src}
      alt="shaking"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: `${width}px`,
        height: `${height}px`,
        transition: 'transform 0.1s',
        transform: shake
          ? `translate(${Math.random() * shakeStrength * 2 - shakeStrength}px, 
                       ${Math.random() * shakeStrength * 2 - shakeStrength}px)`
          : 'translate(0, 0)',
      }}
    />
  );
}

export default ShakingImage;

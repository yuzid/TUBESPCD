import React from 'react';

function Image({ src, topPercent, leftPercent, width = 100, height = 100 }) {
  return (
    <img
      src={src}
      alt="static"
      style={{
        position: 'absolute',
        top: `${topPercent}%`,
        left: `${leftPercent}%`,
        transform: 'translate(-50%, -50%)',
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}

export default Image;

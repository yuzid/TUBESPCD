import React from 'react';

function Image({ src, x, y, width = 100, height = 100 }) {
  return (
    <img
      src={src}
      alt="static"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: `${width}px`,
        height: `${height}px`,
      }}
    />
  );
}

export default Image;

import { useState } from 'react';
import reactlogo from '../assets/react.svg';
import ShakingImage from '../component/shakingimg';
import Image from '../component/img';

function Game() {

  
  const [isShaking, setIsShaking] = useState(true); 

  return (
    <>
      {isShaking ? (
        <ShakingImage
          src={reactlogo}
          x={600}
          y={300}
          width={300}
          height={300}
          shakeStrength={15}
          shakeInterval={200}
        />
      ) : (
        <Image
          src={reactlogo}
          x={600}
          y={300}
          width={300}
          height={300}
        />
      )}
    </>
  );
}

export default Game;

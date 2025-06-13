import { useState, useEffect } from 'react';
import ShakingImage from '../component/shakingimg';
import Image from '../component/img';
import background from '../assets/background.png';
import toy1 from '../assets/toy1.png';
import toy2 from '../assets/toy2.png';

function Game() {

  const [isShaking, setIsShaking] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const toys = [
    { src: toy1, x: 100, y: 200 },
    { src: toy2, x: 300, y: 400 }
  ];

  const [shakingToyIndex, setShakingToyIndex] = useState(null);

  useEffect(() => {
    let timeoutId;

    const startShakingCycle = () => {
      const delay = Math.floor(Math.random() * (30 - 10 + 1) + 10) * 1000;

      timeoutId = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * toys.length);
        setShakingToyIndex(randomIndex);

        timeoutId = setTimeout(() => {
          setShakingToyIndex(null);
          startShakingCycle(); // ulangi
        }, 5000);
      }, delay);
    };

    startShakingCycle();

    return () => clearTimeout(timeoutId);
  }, [toys.length]);


  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {toys.map((toy, index) => (
        shakingToyIndex === index ? (
          <ShakingImage
            key={index}
            src={toy.src}
            x={toy.x}
            y={toy.y}
            width={300}
            height={300}
            shakeStrength={15}
            shakeInterval={200}
          />
        ) : (
          <Image
            key={index}
            src={toy.src}
            x={toy.x}
            y={toy.y}
            width={300}
            height={300}
          />
        )
      ))}
    </div>
  );
}

export default Game;

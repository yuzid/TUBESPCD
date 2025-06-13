import { useState, useEffect } from 'react';
import ShakingImage from '../component/shakingimg';
import Image from '../component/img';
import background from '../assets/background.png';
import toy1 from '../assets/toy1.png';
import toy2 from '../assets/toy2.png';
import jumpscare3 from '../assets/jumpscare3.png';
import EyeStateSender from '../component/EyeStateSocket';

function Game() {
  const [iseyeclosed, setEyeClosed] = useState(true);
  const [shakingToyIndex, setShakingToyIndex] = useState(null);
  const [eyeSafeDuringShake, setEyeSafeDuringShake] = useState(true);
  const [jumpscareSrc, setJumpscareSrc] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const toys = [
    { src: toy1, x: 100, y: 200 },
    { src: toy2, x: 300, y: 400 }
  ];

  useEffect(() => {
    let timeoutId;

    const startShakingCycle = () => {
      const delay = Math.floor(Math.random() * (30 - 10 + 1) + 10) * 1000;

      timeoutId = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * toys.length);
        setShakingToyIndex(randomIndex);
        setEyeSafeDuringShake(true); // reset aman

        timeoutId = setTimeout(() => {
          if (eyeSafeDuringShake) {
            setShakingToyIndex(null);
            startShakingCycle(); // lanjut ke siklus baru
          }
          // Jika tidak aman, biarkan useEffect di bawah yang menangani
        }, 5000);
      }, delay);
    };

    startShakingCycle();

    return () => clearTimeout(timeoutId);
  }, [toys.length]);

    useEffect(() => {
  console.log('Eye closed:', iseyeclosed);
    }, [iseyeclosed]);


  useEffect(() => {
    if (shakingToyIndex !== null && iseyeclosed === false) {
      setEyeSafeDuringShake(false);
    }
  }, [iseyeclosed, shakingToyIndex]);

  useEffect(() => {
    if (!eyeSafeDuringShake && shakingToyIndex !== null && !jumpscareSrc && !isGameOver) {
      const images = [jumpscare3];
      const random = Math.floor(Math.random() * images.length);
      setJumpscareSrc(images[random]);

      setTimeout(() => {
        setIsGameOver(true);
        setShakingToyIndex(null); // stop shaking
      }, 2000);
    }
  }, [eyeSafeDuringShake, shakingToyIndex, isGameOver, jumpscareSrc]);

  return (
    <>
      <EyeStateSender onEyeStateChange={setEyeClosed} />

      {/* Debug UI (opsional, hapus di production) */}
      {/* <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', zIndex: 9999 }}>
        <p>eyeClosed: {iseyeclosed.toString()}</p>
        <p>eyeSafeDuringShake: {eyeSafeDuringShake.toString()}</p>
        <p>shakingToyIndex: {shakingToyIndex}</p>
        <p>gameOver: {isGameOver.toString()}</p>
      </div> */}

      {/* Jumpscare Overlay */}
      {jumpscareSrc && !isGameOver && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
          zIndex: 9999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img src={jumpscareSrc} alt="Jumpscare" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {/* Game Over Screen */}
      {isGameOver && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'black',
          color: 'white',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '3rem',
          fontWeight: 'bold'
        }}>
          GAME OVER
        </div>
      )}

      {/* Game Field */}
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
    </>
  );
}

export default Game;

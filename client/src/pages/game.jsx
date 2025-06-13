import { useState, useEffect, useRef } from 'react';
import ShakingImage from '../component/shakingimg';
import Image from '../component/img';
import background from '../assets/background.png';
import toy1 from '../assets/toy1.png';
import toy2 from '../assets/toy2.png';
import jumpscare1 from '../assets/jumpscare1.png';
import jumpscare2 from '../assets/jumpscare2.png';
import jumpscare3 from '../assets/jumpscare3.png';
import shakingSound from '../assets/shaking.mp3';
import jumpscareSound1 from '../assets/jumpscaresound1.mp3';
import EyeStateSender from '../component/EyeStateSocket';

function Game() {
  const [iseyeclosed, setEyeClosed] = useState(true);
  const [shakingToyIndex, setShakingToyIndex] = useState(null);
  const [eyeSafeDuringShake, setEyeSafeDuringShake] = useState(true);
  const [jumpscareSrc, setJumpscareSrc] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const shakingAudioRef = useRef(new Audio(shakingSound));
  const jumpscareAudioRef = useRef(null);

  const toys = [
    { src: toy1, x: 100, y: 200 },
    { src: toy2, x: 300, y: 400 }
  ];

  const jumpscareImages = [jumpscare1, jumpscare2, jumpscare3];
  const jumpscareSounds = [jumpscareSound1]; // Tambahkan lebih banyak jika ada

  const shakingCycleTimeout = useRef(null);

  const startShakingCycle = () => {
  if (shakingCycleTimeout.current) {
    clearTimeout(shakingCycleTimeout.current);
  }

  const delay = Math.floor(Math.random() * (30 - 10 + 1) + 10) * 1000;

  shakingCycleTimeout.current = setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * toys.length);
    setShakingToyIndex(randomIndex);
    setEyeSafeDuringShake(true);

    shakingCycleTimeout.current = setTimeout(() => {
      if (eyeSafeDuringShake) {
        setShakingToyIndex(null);
        startShakingCycle(); // next cycle
      }
    }, 5000);
  }, delay);
};

  useEffect(() => {
    startShakingCycle();
    return () => clearTimeout(shakingCycleTimeout.current);
  }, []);

  useEffect(() => {
    if (shakingToyIndex !== null && iseyeclosed === false) {
      setEyeSafeDuringShake(false);
    }
  }, [iseyeclosed, shakingToyIndex]);

  useEffect(() => {
    // Audio control during shaking
    const audio = shakingAudioRef.current;
    if (shakingToyIndex !== null && !isGameOver) {
      audio.loop = true;
      audio.currentTime = 0;
      audio.play().catch(err => console.warn('Shaking audio error:', err));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [shakingToyIndex, isGameOver]);

  useEffect(() => {
    let delayTimeout;

    if (!eyeSafeDuringShake && shakingToyIndex !== null && !jumpscareSrc && !isGameOver) {
      delayTimeout = setTimeout(() => {
        if (!iseyeclosed && shakingToyIndex !== null) {
          const rand = Math.floor(Math.random() * jumpscareImages.length);
          const selectedImage = jumpscareImages[rand];
          const selectedSound = jumpscareSounds[rand % jumpscareSounds.length];

          setJumpscareSrc(selectedImage);

          shakingAudioRef.current.pause();
          shakingAudioRef.current.currentTime = 0;

          const audio = new Audio(selectedSound);
          jumpscareAudioRef.current = audio;
          audio.play().catch(err => console.warn('Jumpscare audio error:', err));

          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
            setIsGameOver(true);
            setShakingToyIndex(null);
          }, 2000);
        }
      }, 1000); // delay 1 second
    }

    return () => {
      if (delayTimeout) clearTimeout(delayTimeout);
    };
  }, [eyeSafeDuringShake, shakingToyIndex, isGameOver, jumpscareSrc, iseyeclosed]);

  useEffect(() => {
    if (isGameOver) {
      shakingAudioRef.current.pause();
      shakingAudioRef.current.currentTime = 0;

      if (jumpscareAudioRef.current) {
        jumpscareAudioRef.current.pause();
        jumpscareAudioRef.current.currentTime = 0;
      }
    }
  }, [isGameOver]);

  return (
    <>
      <EyeStateSender onEyeStateChange={setEyeClosed} />

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
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '3rem',
          fontWeight: 'bold'
        }}>
          <div>GAME OVER</div>
          <button
            onClick={() => {
              setIsGameOver(false);
              setJumpscareSrc(null);
              setShakingToyIndex(null);
              setEyeSafeDuringShake(true);

              if (shakingCycleTimeout.current) {
                clearTimeout(shakingCycleTimeout.current);
              }

              startShakingCycle();
            }}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '1.2rem',
              cursor: 'pointer',
              backgroundColor: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: '8px'
            }}
          >
            Try Again
          </button>
        </div>
      )}

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
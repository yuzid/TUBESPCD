import { useState, useEffect, useRef } from 'react';
import ShakingImage from '../component/shakingimg';
import Image from '../component/img';
import background from '../assets/background.png';
import toy1 from '../assets/toy1.png';
import toy2 from '../assets/toy2.png';
import toy3 from '../assets/toy3.png';
import toy4 from '../assets/toy4.png';
import toy5 from '../assets/toy5.png';
import jumpscare1 from '../assets/jumpscare1.png';
import jumpscare2 from '../assets/jumpscare2.png';
import jumpscare3 from '../assets/jumpscare3.png';
import shakingSound from '../assets/shaking.mp3';
import jumpscareSound1 from '../assets/jumpscaresound1.mp3';
import jumpscareSound2 from '../assets/jumpscaresound2.mp3';
import jumpscareSound3 from '../assets/jumpscaresound3.mp3';
import fanfare from '../assets/fanfare.mp3';
import sleepSound from '../assets/sleep.mp3';
import EyeStateSender from '../component/EyeStateSocket';

function Game() {
  const [iseyeclosed, setEyeClosed] = useState(true);
  const [shakingToyIndex, setShakingToyIndex] = useState(null);
  const [eyeSafeDuringShake, setEyeSafeDuringShake] = useState(true);
  const [jumpscareSrc, setJumpscareSrc] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [eyeClosedStartTime, setEyeClosedStartTime] = useState(null);
  const [hasFallenAsleep, setHasFallenAsleep] = useState(false);

  const shakingAudioRef = useRef(new Audio(shakingSound));
  const jumpscareAudioRef = useRef(null);
  const victoryTimerRef = useRef(null);
  const fanfareAudioRef = useRef(new Audio(fanfare));
  const sleepAudioRef = useRef(new Audio(sleepSound));

  const toys = [
    { src: toy1, x: 300, y: 800, width: 200, height: 200 },
    { src: toy2, x: 600, y: 750, width: 250, height: 250 },
    { src: toy3, x: 800, y: 800, width: 200, height: 200 },
    { src: toy4, x: 1200, y: 800, width: 200, height: 200 },
    { src: toy5, x: 1400, y: 800, width: 200, height: 200 }
  ];

  const jumpscareImages = [jumpscare1, jumpscare2, jumpscare3];
  const jumpscareSounds = [jumpscareSound1, jumpscareSound2, jumpscareSound3];

  const shakingCycleTimeout = useRef(null);

  const startShakingCycle = () => {
    if (isGameOver || isVictory || hasFallenAsleep) return;

    if (shakingCycleTimeout.current) {
      clearTimeout(shakingCycleTimeout.current);
    }

    const delay = Math.floor(Math.random() * (30 - 10 + 1) + 10) * 1000;

    shakingCycleTimeout.current = setTimeout(() => {
      if (isGameOver || isVictory || hasFallenAsleep) return;

      const randomIndex = Math.floor(Math.random() * toys.length);
      setShakingToyIndex(randomIndex);
      setEyeSafeDuringShake(true);

      shakingCycleTimeout.current = setTimeout(() => {
        setShakingToyIndex(null);
        if (eyeSafeDuringShake && !isVictory && !hasFallenAsleep && !isGameOver) {
          startShakingCycle();
        }
      }, 5000);
    }, delay);
  };

  useEffect(() => {
    startShakingCycle();
    return () => clearTimeout(shakingCycleTimeout.current);
  }, []);

  useEffect(() => {
    victoryTimerRef.current = setTimeout(() => {
      if (!isGameOver && !isVictory && !hasFallenAsleep) {
        setIsVictory(true);
        setShakingToyIndex(null);
      }
    }, 2 * 60 * 1000);

    return () => clearTimeout(victoryTimerRef.current);
  }, []);

  useEffect(() => {
    if (shakingToyIndex !== null && iseyeclosed === false && !isVictory) {
      setEyeSafeDuringShake(false);
    }
  }, [iseyeclosed, shakingToyIndex]);

  useEffect(() => {
    const audio = shakingAudioRef.current;
    if (shakingToyIndex !== null && !isGameOver && !isVictory && !hasFallenAsleep) {
      audio.loop = true;
      audio.currentTime = 0;
      audio.play().catch(err => console.warn('Shaking audio error:', err));
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [shakingToyIndex, isGameOver, isVictory, hasFallenAsleep]);

  useEffect(() => {
    let delayTimeout;

    if (!eyeSafeDuringShake && shakingToyIndex !== null && !jumpscareSrc && !isGameOver && !isVictory && !hasFallenAsleep) {
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
      }, 1500);
    }

    return () => {
      if (delayTimeout) clearTimeout(delayTimeout);
    };
  }, [eyeSafeDuringShake, shakingToyIndex, isGameOver, jumpscareSrc, iseyeclosed]);

  useEffect(() => {
    if (isGameOver) {
      // Stop all audio
      shakingAudioRef.current.pause();
      shakingAudioRef.current.currentTime = 0;

      if (jumpscareAudioRef.current) {
        jumpscareAudioRef.current.pause();
        jumpscareAudioRef.current.currentTime = 0;
      }

      // Cancel victory timer
      if (victoryTimerRef.current) {
        clearTimeout(victoryTimerRef.current);
        victoryTimerRef.current = null;
      }
    }
  }, [isGameOver]);

  useEffect(() => {
    if (hasFallenAsleep) {
      if (victoryTimerRef.current) {
        clearTimeout(victoryTimerRef.current);
        victoryTimerRef.current = null;
      }
    }
  }, [hasFallenAsleep]);

  useEffect(() => {
    const fanfareAudio = fanfareAudioRef.current;

    if (isVictory) {
      shakingAudioRef.current.pause();
      shakingAudioRef.current.currentTime = 0;

      if (jumpscareAudioRef.current) {
        jumpscareAudioRef.current.pause();
        jumpscareAudioRef.current.currentTime = 0;
      }

      fanfareAudio.currentTime = 0;
      fanfareAudio.play().catch(err => console.warn('Fanfare audio error:', err));
    } else {
      fanfareAudio.pause();
      fanfareAudio.currentTime = 0;
    }
  }, [isVictory]);

  useEffect(() => {
    let sleepTimer = null;

    if (iseyeclosed && !eyeClosedStartTime && !isGameOver && !isVictory && !hasFallenAsleep) {
      setEyeClosedStartTime(Date.now());
    }

    if (!iseyeclosed && eyeClosedStartTime) {
      setEyeClosedStartTime(null);
    }

    if (eyeClosedStartTime) {
      sleepTimer = setInterval(() => {
        const elapsed = Date.now() - eyeClosedStartTime;
        if (elapsed >= 30000 && !hasFallenAsleep) {
          setHasFallenAsleep(true);
          setShakingToyIndex(null);
          setEyeClosedStartTime(null);
        }
      }, 1000);
    }

    return () => clearInterval(sleepTimer);
  }, [iseyeclosed, eyeClosedStartTime, hasFallenAsleep, isGameOver, isVictory]);

  useEffect(() => {
    const sleepAudio = sleepAudioRef.current;

    if (hasFallenAsleep) {
      shakingAudioRef.current.pause();
      shakingAudioRef.current.currentTime = 0;

      if (jumpscareAudioRef.current) {
        jumpscareAudioRef.current.pause();
        jumpscareAudioRef.current.currentTime = 0;
      }

      sleepAudio.currentTime = 0;
      sleepAudio.play().catch(err => console.warn('Sleep audio error:', err));
    } else {
      sleepAudio.pause();
      sleepAudio.currentTime = 0;
    }
  }, [hasFallenAsleep]);

  useEffect(() => {
    if (isVictory || hasFallenAsleep) {
      if (shakingCycleTimeout.current) {
        clearTimeout(shakingCycleTimeout.current);
      }
      setShakingToyIndex(null);
    }
  }, [isVictory, hasFallenAsleep]);

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
              window.location.reload();
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

      {isVictory && (
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
          <div>YOU HAVE CONQUERED THE NIGHT</div>
          <button
            onClick={() => window.location.reload()}
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
            Play Again
          </button>
        </div>
      )}

      {hasFallenAsleep && (
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
          <div>YOU HAVE FALLEN ASLEEP LIKE A LOG</div>
          <button
            onClick={() => window.location.reload()}
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
            Wake Up and Try Again
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
        {shakingToyIndex !== null && !isGameOver && !isVictory && (
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '3rem',
            fontWeight: 'bold',
            color: 'red',
            zIndex: 10,
          }}>
            CLOSE YOUR EYES
          </div>
        )}
        {toys.map((toy, index) => (
          shakingToyIndex === index ? (
            <ShakingImage
              key={index}
              src={toy.src}
              x={toy.x}
              y={toy.y}
              width={toy.width}
              height={toy.height}
              shakeStrength={15}
              shakeInterval={200}
            />
          ) : (
            <Image
              key={index}
              src={toy.src}
              x={toy.x}
              y={toy.y}
              width={toy.width}
              height={toy.height}
            />
          )
        ))}
      </div>
    </>
  );
}

export default Game;
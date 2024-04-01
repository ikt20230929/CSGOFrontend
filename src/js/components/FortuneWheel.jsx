import React, { useState, useRef, useEffect } from 'react';

export default function FortuneWheel({ number, spinTrigger, resetSpinTrigger, success, setOpenModal }) {
  const [value, setValue] = useState(1800);
  const [isSpinning, setIsSpinning] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(false)
  const angle = Math.min(number, 100) / 100 * 360; 
  const wheelRef = useRef(null);
  const winRef = useRef(null);

  const color = `rgb(99, 234, 255)`;
  const boxShadow = `0 0 0 1px ${color}`;

  const checkWin = () => {
    const winElement = winRef.current;
    const winRect = winElement.getBoundingClientRect();
    const winPoint = { x: winRect.left + winRect.width / 2, y: winRect.bottom + 1 };
    const greenElements = document.querySelectorAll('.green');
    let won = false;
    greenElements.forEach((greenElement) => {
      
    if (document.elementFromPoint(winPoint.x, winPoint.y).classList.contains("green")) {
      won = true;
    }
    setOpenModal(true);
      
    });
    setTimeout(() => {
      setIsSpinning(false);
      wheelRef.current.removeEventListener('transitionend', checkWin);
      setTransitionEnabled(false);
      setValue(1800);
    }, 400); 
  };  

  const spin = () => {
    setTransitionEnabled(true);

    setIsSpinning(true);
    let newValue = value;
    console.log(success)
    if (success == true) {
      newValue += Math.floor(Math.random() * (angle) + (5489 - angle));
      console.log(angle)
    } else {
      newValue += Math.floor(Math.random() * (5495 - 5489 + (360 - angle)) + 5489);
      console.log(angle)
    }
    setValue(newValue);
    wheelRef.current.addEventListener('transitionend', checkWin);
  };

  useEffect(() => {
    if (spinTrigger) {
        spin();
        resetSpinTrigger();
    }
  }, [spinTrigger, resetSpinTrigger, spin]);


  useEffect(() => {
    if (spinTrigger) {
        spin();
        resetSpinTrigger();
    }
  }, [spinTrigger, resetSpinTrigger, spin]);

  return (
    <div className="wheelContainer">
      <div className="wheelCenter"/>
      <div className="win" ref={winRef}></div>
      <div className="wheel" style={{ transform: `rotate(${value}deg)`, transition: transitionEnabled ? 'transform 5s' : 'none' }} ref={wheelRef}>
        <div
          className="number quarter green default"
          style={{
            '--i': 1,
            boxShadow: number >= 25 ? `${boxShadow}` : '',
          }}
        >
        </div>
        {number < 25  && (
          <div
            className="quarter under25"
            style={{
              bottom: '50%',
              left: '50%',
              backgroundColor: 'rgba(119, 119, 119)',
              transformOrigin: 'bottom left',
              transform: `rotate(${270 + angle}deg)`,
            }}
          ></div>
        )}
        {number > 25  && (
          <div
            className="quarter green 25"
            style={{
              bottom: '0%',
              left: '0%',
              transformOrigin: 'top right',
              transform: number <= 50 ? `rotate(${angle}deg)` : 'rotate(180deg)',
              boxShadow: number >= 50 ? `${boxShadow}` : '',
            }}
          ></div>
        )}
        {number > 50  && (
          <div
            className="quarter green 50"
            style={{
              bottom: '0%',
              left: '50%',
              transformOrigin: 'top left',
              transform: number <= 75 ? `rotate(${90 + angle}deg)` : 'rotate(0  deg)',
              boxShadow: number >= 75 ? `${boxShadow}` : '',
            }}
          ></div>
        )}
        {number > 75  && (
          <div
            className="quarter green 75"
            style={{
              bottom: '50%',
              left: '50%',
              transformOrigin: 'bottom left',
              transform: `rotate(${180 + angle}deg)`,
              boxShadow: number == 100 ? `${boxShadow}` : '',
            }}
          ></div>
        )}
      </div>
    </div>
  );
}


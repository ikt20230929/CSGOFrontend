import React, { useState, useRef, useEffect } from 'react';

export default function FortuneWheel({ number, spinTrigger, resetSpinTrigger }) {
  const [value, setValue] = useState(Math.ceil(Math.random() * 3600) + 1800);
  const [isSpinning, setIsSpinning] = useState(false);
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
      const greenRect = greenElement.getBoundingClientRect();
      console.log(document.elementFromPoint(winPoint.x, winPoint.y).classList);
      if (document.elementFromPoint(winPoint.x, winPoint.y).classList.contains("green")) {
        won = true;
      }
      console.log(document.elementFromPoint(winPoint.x, winPoint.y).classList);
    });
    setTimeout(() => {
      if (won) {
        alert('NYERTÉL!');
      } else {
        alert('Nem nyertél.');
      }
      setIsSpinning(false);
      wheelRef.current.removeEventListener('transitionend', checkWin);
    }, 200); 
  };  

  const spin = () => {
    setIsSpinning(true);
    const newValue = value + Math.ceil(Math.random() * 3600);
    setValue(newValue);
    wheelRef.current.addEventListener('transitionend', checkWin);
  };

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
      <div className="wheel" style={{ transform: `rotate(${value}deg)`, transition: 'transform 5s' }} ref={wheelRef}>
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
              transform: number <= 75 ? `rotate(${90 + angle}deg)` : '',
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
              transform: `rotate(${angle}deg)`,
              boxShadow: number == 100 ? `${boxShadow}` : '',
            }}
          ></div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';


export default function FortuneWheel() {
  const [value, setValue] = useState(Math.ceil(Math.random() * 3600));
  const [number, setNumber] = useState(50); 
  const [isSpinning, setIsSpinning] = useState(false);
  const angle = Math.min(number, 100) / 100 * 360; 
  const wheelRef = useRef(null);
  const winRef = useRef(null);

  
  const checkWin = () => {
    const winElement = winRef.current;
    const winRect = winElement.getBoundingClientRect();
    const winPoint = { x: winRect.left + winRect.width / 2, y: winRect.bottom };
    const greenElements = document.querySelectorAll('.green');
    let won = false;
    greenElements.forEach((greenElement) => {
      const greenRect = greenElement.getBoundingClientRect();
      console.log(document.elementFromPoint(winPoint.x, winPoint.y).classList);
      if (document.elementFromPoint(winPoint.x, winPoint.y).classList.contains("green")) {
        won = true;
      }
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

  return (
    <div className="wheelContainer">
      <div className="wheelCenter" onClick={!isSpinning ? spin : null}/>
      <div className="win" ref={winRef}></div>
      <div className="wheel" style={{ transform: `rotate(${value}deg)`, transition: 'transform 5s' }} ref={wheelRef}>
        <div
          className="number quarter green"
          style={{
            '--i': 1,
            boxShadow: number >= 25 ? '0 0 0 1px green' : '',
          }}
        >
        </div>
        {number < 25  && (
          <div
            className="quarter"
            style={{
              bottom: '50%',
              left: '50%',
              backgroundColor: 'red',
              transformOrigin: 'bottom left',
              transform: `rotate(${270 + angle}deg)`,
            }}
          ></div>
        )}
        {number > 25  && (
          <div
            className="quarter green"
            style={{
              bottom: '0%',
              left: '0%',
              transformOrigin: 'top right',
              transform: number <= 50 ? `rotate(${angle}deg)` : '',
              boxShadow: number >= 50 ? '0 0 0 1px green' : '',
            }}
          ></div>
        )}
        {number > 50  && (
          <div
            className="quarter green"
            style={{
              bottom: '0%',
              left: '50%',
              transformOrigin: 'top left',
              transform: number <= 75 ? `rotate(${angle}deg)` : '',
              boxShadow: number >= 75 ? '0 0 0 1px green' : '',
            }}
          ></div>
        )}
        {number > 75  && (
          <div
            className="quarter green"
            style={{
              bottom: '50%',
              left: '50%',
              transformOrigin: 'bottom left',
              transform: `rotate(${angle}deg)`,
              boxShadow: number == 100 ? '0 0 0 1px green' : '',
            }}
          ></div>
        )}
      </div>
    </div>
  );
}

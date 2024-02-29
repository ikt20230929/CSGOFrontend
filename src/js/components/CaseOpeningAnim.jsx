import React, { useState, useEffect } from 'react';
import './anim.css';

const CardList = () => {
    const [margin, setMargin] = useState(0);
    const [spin, setSpin] = useState(false);
    const [items, setItems] = useState(Array.from({length: 32}, (_, i) => i + 1));
    const [transitionEnabled, setTransitionEnabled] = useState(true);

    useEffect(() => {
        if (spin) {
            setTransitionEnabled(false);
            setMargin(0);

            setTimeout(() => {
                setTransitionEnabled(true);
                const newDistance = ((9 + (Math.random() * 0.355)) * (items.length - 7));
                console.log(newDistance, items.length);
                setMargin(-newDistance * 10);
                
                
                setTimeout(() => {
                    setSpin(false);
                }, 7700); 
            }, 50);  
        }
    }, [spin, items]);

    const spinHandler = () => {
        setSpin(true);
    };

    return (
        <div>
            <div className='spinContainer'>
              <div className="itemContainer" style={{
                  marginLeft: `${margin}px`, 
                  transition: transitionEnabled ? 'margin-left 7.5s' : 'none'
              }}>
                  {items.map((item, index) => (
                      <div key={index} className="spinItem">
                          {item}
                      </div>
                  ))}
              </div>
            </div>
            <button onClick={spinHandler} disabled={spin}>Spin</button>
        </div>
    );
};

export default CardList;

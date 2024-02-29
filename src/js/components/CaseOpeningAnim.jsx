import React, { useState, useEffect } from 'react';

const CaseAnim = () => {
    const [margin, setMargin] = useState(0);
    const [spin, setSpin] = useState(false);
    const [items, setItems] = useState(Array.from({length: 32}, (_, i) => i + 1));

    useEffect(() => {
        if (spin) {
            const newDistance = ((9 + (Math.random() * 0.355)) * (items.length - 7));
            console.log(newDistance, items.length);
            alert("GG MEGNYERTED A 27-est!!!")

            setMargin(-newDistance * 10);
            setSpin(false);
        }
    }, [spin, items]);

    const spinHandler = () => {
        setSpin(true);
        setMargin(0);
    };

    return (
        <div>
            <div className='spinContainer'>
              <div className="itemContainer" style={{marginLeft: `${margin}px`, transition: 'margin-left 7.5s'}}>
                  {items.map((item, index) => (
                      <div key={index} className="spinItem">
                          {item}
                      </div>
                  ))}
              </div>
            </div>
            <button onClick={spinHandler}>Spin</button>
        </div>
    );
};

export default CaseAnim;

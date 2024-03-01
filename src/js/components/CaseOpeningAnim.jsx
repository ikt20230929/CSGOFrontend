import React, { useState, useEffect } from 'react';
import { Button, Center, Space, Notification } from '@mantine/core';

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
            {spin==true && (
        <Center>
                    <Notification withCloseButton={false} className='openalert' withBorder color="cyan" radius="lg" title="Láda nyitása folyamatban...">
      </Notification>
      </Center>
            )}
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
            <Space h="md"></Space>
            <Center>
      <Button type="submit" size='md' variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90 }} radius="lg"  onClick={spinHandler} disabled={spin} >Láda kinyitása</Button>
      </Center>
        </div>
    );
};

export default CardList;

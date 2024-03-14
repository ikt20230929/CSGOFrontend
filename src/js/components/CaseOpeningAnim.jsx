import React, { useState, useEffect } from 'react';
import { Button, Center, Space, Notification } from '@mantine/core';
import axios from 'axios';
import { API_URL } from "../settings.js";
import store from "../store.js";

const CardList = ({caseId}) => {

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
                const newDistance = 228 + Math.random() * (220 - 228);
                console.log(newDistance, items.length);
                setMargin(-newDistance * 10);
                
                
                setTimeout(() => {
                    setSpin(false);
                }, 7700); 
            }, 50);  
        }
    }, [spin, items]);

    const spinHandler = async () => {
        setSpin(true);

        // Add the logic to open the case here
        try {
            const response = await axios({
                method: 'post',
                url: `${API_URL}/open_case/${caseId}`,
                headers: {
                    'Authorization': `Bearer ${store.getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                alert(`You won: ${response.data.itemName}`);
            }
        } catch (error) {
            console.log("Ez a hiba faszos fasz:");
            console.error(error);
            console.log(response);
        }
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

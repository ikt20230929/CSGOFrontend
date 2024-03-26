import React, { useState, useEffect } from 'react';
import { Button, Center, Space, Notification } from '@mantine/core';
import { fetchEndpoint, useSelector } from "../store.js";

const CardList = ({caseId}) => {

    const [margin, setMargin] = useState(0);
    const [spin, setSpin] = useState(false);
    const [items, setItems] = useState([]);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const cases = useSelector(state => state.data.cases);

    const fetchCases = async () => {
        try {
            const caseItems = cases.filter(caseItem => caseItem.caseId == caseId)[0].items;
            console.log(caseItems);
    
            // A tárgyakat ritkaság szerint súlyozzuk
            const weightedItems = [];
            caseItems.forEach(item => {
                const weight = 9 - item.itemRarity;
                for (let i = 0; i < weight; i++) {
                    weightedItems.push(item.itemSkinName);
                }
            });
    
            // Frissítjük az items állapotot
            setItems(Array.from({length: 32}, () => weightedItems[Math.floor(Math.random() * weightedItems.length)]));
    
        } catch (error) {
            console.error('Hiba a láda betöltése közben!', error);
        }
    };
    

    useEffect(() => {
        //fetchCases();

    }, [caseId]);

    useEffect(() => {
        if (spin) {
            setTransitionEnabled(false);
            setMargin(0);

            setTimeout(() => {
                setTransitionEnabled(true);
                const newDistance = 228 + Math.random() * (220 - 228);
                setMargin(-newDistance * 10);
                
                setTimeout(() => {
                    setSpin(false);
                    if (!spin) {
                        fetchCases();
                    }
                }, 7700); 
            }, 50);  
        }

    }, [spin]);

    const spinHandler = async () => {
        setSpin(true);
        
        try {
            const response = await fetchEndpoint(`open_case/${caseId}`);

            if (response.success) {

                // Ha a nyitás sikeres, a győztes slot-ra kerül a nyeremény
                items[26] = response.data.itemSkinName;
                console.log(response.data.itemSkinName);
            }
        } catch (error) {
            alert('Hiba a nyitás során!');
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

import React, { useState, useEffect } from 'react';
import { Button, Center, Space, Notification, Modal } from '@mantine/core';
import axios from 'axios';
import { API_URL } from "../settings";
import { useSelector } from 'react-redux';
import store from "../store";

const CardList = ({ caseId }) => {

    const [margin, setMargin] = useState(0);
    const [spin, setSpin] = useState(false);
    const [items, setItems] = useState([]);
    const [transitionEnabled, setTransitionEnabled] = useState(true);
    const cases = useSelector(state => state.data.cases);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [onError, setOnError] = useState(false);
    const [winnerItem, setWinnerItem] = useState("");

    const fetchCases = async () => {
        try {
            const caseItems = cases.filter(caseItem => caseItem.caseId == caseId)[0].items;
            console.log(caseItems);


            // A tárgyakat ritkaság szerint súlyozzuk
            const weightedItems = [];
            caseItems.forEach(item => {
                const weight = 9 - item.itemRarity;
                for (let i = 0; i < weight; i++) {
                    weightedItems.push(item.itemAssetUrl);
                }
            });

            // Frissítjük az items állapotot
            setItems(Array.from({ length: 32 }, () => weightedItems[Math.floor(Math.random() * weightedItems.length)]));

        } catch (error) {
            console.error('Hiba a láda betöltése közben!', error);
        }
    };


    useEffect(() => {
        fetchCases();

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
                    setIsModalOpen(true);
                }, 7700);
            }, 50);
        }

    }, [spin]);

    const spinHandler = async () => {

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

                // Ha a nyitás sikeres, a győztes slot-ra kerül a nyeremény
                const winnerItemName = response.data.message;

                setWinnerItem(winnerItemName);
                items[26] = winnerItemName.itemAssetUrl;
            }
            setSpin(true);
        } catch (error) {
            setOnError(true);
        }
    };

    return (
        <div>
            {spin == true && (
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
                            <img src={item} style={{ width: "95px" }}></img>
                        </div>
                    ))}
                </div>
            </div>
            <Space h="md"></Space>
            <Center>
                <Button type="submit" size='md' variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90 }} radius="lg" onClick={spinHandler} disabled={spin} >Láda kinyitása</Button>
            </Center>
            <Modal
                opened={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Gratulálunk!"
            >
                <div>Nyereményed: {winnerItem.itemSkinName}</div>
                <img src={winnerItem.itemAssetUrl} style={{ width: "200px" }}></img>
            </Modal>
            <Modal
                opened={onError}
                onClose={() => setOnError(false)}
                title="Hiba a nyitás során!"
            >
                <div>Nem rendelkezel elegendő egyenleggel!</div>
            </Modal>
        </div>
    );
};

export default CardList;

import React, { useState, useEffect } from "react";
import { Card, Group, Text, Space, Modal, Button, TextInput, FileInput, Grid, Center, NumberFormatter, Notification } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useSelector, useDispatch } from "react-redux";
import InventorySearchWrapper from "../components/InventorySearchWrapper";
import axios from "axios";
import { API_URL } from "../settings";
import { fetchProfile } from "../Globals";
import store, { actions } from "../store";
const { setProfile, setInventory } = actions;

export default function ProfilePage() {
    const errorModal = useDisclosure(false);
    const [span, setSpan] = useState(3);

    const dispatch = useDispatch();
    const { profile, inventory } = useSelector(state => state.data);
    const [opened, { open, close }] = useDisclosure(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [confirmSellModal, { open: openConfirmSellModal, close: closeConfirmSellModal }] = useDisclosure(false);
    const [sellConfirmationModal, { open: openSellConfirmationModal, close: closeSellConfirmationModal }] = useDisclosure(false);
    const [isInventoryUpdated, setIsInventoryUpdated] = useState(false);

    useEffect(() => {
        fetchProfile()
            .then(success => {
                if (success) {
                    const { profile, inventory } = store.getState().data;
                    dispatch(setProfile(profile));
                    dispatch(setInventory(inventory));
                }
            });
        setIsInventoryUpdated(false);
        setSelectedItems([]);
    }, [dispatch, isInventoryUpdated]);

    const handlebtnclick = () => {
        setShowNotification(true);
    };

    const handleSell = () => {
        openConfirmSellModal();
    };

    const confirmSell = async () => {
        closeConfirmSellModal();
        try {
            await Promise.all(selectedItems.map(async (element) => {
                const response = await axios({
                    method: 'post',
                    url: `${API_URL}/sell_item/${element}`,
                    headers: {
                        'Authorization': `Bearer ${store.getState().auth.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                });
            }));
            setIsInventoryUpdated(true);
            openSellConfirmationModal();
        } catch (error) {
            errorModal[1].open();
        }
    };

    const checkoutItems = async () => {
        try {
            const response = await axios({
                method: 'post',
                url: `${API_URL}/items/withdraw`,
                headers: {
                    'Authorization': `Bearer ${store.getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    items: selectedItems
                }
            })
            setIsInventoryUpdated(true);
            setShowNotification(true)
        } catch (error) {
            errorModal[1].open();
        }
    }

    const toggleItemSelection = (itemId) => {
        if (selectedItems.includes(itemId)) {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        } else {
            setSelectedItems([...selectedItems, itemId]);
        }
    };

    useEffect(() => {
        const handleResize = () => {
          const width = window.innerWidth;
          if (width < 820) {
            setSpan(6);
          } else if (width < 1200) {
            setSpan(4);
          } else {
            setSpan(3);
          }
        };
    
        window.addEventListener('resize', handleResize);
        handleResize();
    
        return () => window.removeEventListener('resize', handleResize);
      }, [window.innerWidth]);

    return (
        <div>
            <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ minHeight: "calc(100vh - 3.5rem)" }}>
                <Group justify="space-between" mt="lg" mb="xs">
                    <Text size='5vw' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(143, 143, 143, 1)', deg: 90 }}>
                        {profile.userName} profilja
                    </Text>
                </Group>
                <Space h="sm" />
                <Text size="xl">Egyenleged: <NumberFormatter prefix="$" fixedDecimalScale={true} decimalScale={2} value={profile.userBalance} /></Text>
                <Space h="xl" />
                <Space h="xs"></Space>
                <Button onClick={() => handleSell(selectedItems)} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
                    Kiválasztott tárgyak eladása
                </Button>
                <Space h="xs"></Space>
                <Button onClick={() => { handlebtnclick; checkoutItems() }} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
                    Kiválasztott tárgyak kikérése
                </Button>
                <Center>
                    {showNotification && (
                        <Notification withCloseButton={true} className='openalert' withBorder color="cyan" radius="lg" title="A kiválaszott tárgyak hamarosan a Steam csere kérelmeid között lesznek!" onClose={() => setShowNotification(false)} />
                    )}
                </Center>
                <Group justify="space-between">
                    <h2 style={{ color: 'white' }}>Megszerzett tárgyak: ({inventory.length} db)</h2>
                    <TextInput placeholder="Keresés" classNames={{ input: 'regpage' }} onChange={event => setSearchTerm(event.currentTarget.value)} />
                </Group>
                <Grid gutter="lg">
                    <InventorySearchWrapper searchTerm={searchTerm} items={[...inventory].sort((a, b) => b.itemRarity - a.itemRarity)} onToggleItem={toggleItemSelection} onProfile={true} spanWidth={span}/>
                </Grid>
                <Modal opened={confirmSellModal} onClose={closeConfirmSellModal} title="Eladás megerősítése" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
                    <Text>Biztosan el akarod adni a kiválasztott tárgyakat?</Text>
                    <Space h="md" />
                    <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={confirmSell}>
                        Eladás
                    </Button>
                    <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={closeConfirmSellModal}>
                        Mégse
                    </Button>
                </Modal>
                <Modal opened={sellConfirmationModal} onClose={closeSellConfirmationModal} title="Eladás megerősítve" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
                    <Text>Az eladás sikeresen megtörtént!</Text>
                    <Space h="md" />
                    <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={closeSellConfirmationModal}>
                        Ok
                    </Button>
                </Modal>
                <Modal opened={errorModal[0]} onClose={errorModal[1].close} title="Hiba a művelet során!" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
                    <Text>Valamilyen hiba lépett fel! Elnézésedet kérjük!</Text>
                    <Button onClick={errorModal[1].close}>OK</Button>
                </Modal>
            </Card>
        </div>
    );
}

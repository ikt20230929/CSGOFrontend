import React, { useState, useEffect, useCallback } from 'react';
import { Button, Text, Card, Space, Group, TextInput, Grid, Center, Modal } from '@mantine/core';
import FortuneWheel from '../components/FortuneWheel';
import { useSelector, useDispatch } from "react-redux";
import InventorySearchWrapper from "../components/InventorySearchWrapper";
import {Link} from 'react-router-dom';
import axios from 'axios';
import store from '../store';
import { API_URL } from '../settings';
import { fetchProfile } from '../Globals';

const MultiplierWheel = () => {
    const { profile, inventory } = useSelector(state => state.data);
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ allItems, setAllItems ] = useState([]); // A lehetséges nyeremények
    const [selectedItems, setSelectedItems] = useState([]); // A fejlesztésre kiválasztott tárgyak listája
    const [upgradeChance, setUpgradeChance] = useState([]); // A lehetséges nyeremények, és azok esélyét tartalmazó objektum tömb
    const [spinTrigger, setSpinTrigger] = useState(false); // Pörgetés indítaása
    const [chance, setChance] = useState(66); // A sikeres fejlesztés esélye
    const [winSelection, setWinSelection] = useState(0); // A nyereményként kiválasztott tárgy
    const [isSuccess, setIsSuccess] = useState(true); // A fejlesztés kimenetele (true, false)
    const [openModel, setOpenModal] = useState(false); // Párbeszéd ablak megnyitása
    const [itemAccepted, setItemAccepted] = useState(false) // A párbeszédablak bezárása
    const dispatch = useDispatch();

    // Pörgetés elindítása
    const triggerSpin = useCallback(async () => {
        handleUpgrade(winSelection, selectedItems);
    }, [winSelection, selectedItems]);

    // Pörgetés leállítása
    const resetSpinTrigger = useCallback(() => {
        setSpinTrigger(false);
    }, []);

    // A kiválasztott itemek tömbbe rendezése, 
    // amennyiben a tárgy szerepeli a tömbben onnan való eltávolítása
    const toggleItemSelection = (itemId) => {
        let newSelectedItems;
        if (selectedItems.includes(itemId)) {
            newSelectedItems = selectedItems.filter((id) => id !== itemId);
        } else {
            newSelectedItems = [...selectedItems, itemId];
        }
        setSelectedItems(newSelectedItems);
        if (newSelectedItems.length >= 1) {
            fetchUpgradeItems(newSelectedItems);
        }
    };

    // Lehetséges nyeremények listázása
    const fetchUpgradeItems = async (itemsToUpgrade) => {
        try {
            const response = await axios({
                method: 'post',
                url: `${API_URL}/items/upgrades`,
                headers: {
                    'Authorization': `Bearer ${store.getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    Items: itemsToUpgrade,
                    Multiplier: 1
                    
                }
            });
            const items = response.data.items.map(obj => obj.item);
            setAllItems(items);
    
            const upgradeChanceArray = response.data.items.map(obj => {
              return {
                  itemId: obj.item.itemId, 
                  chance: obj.chance
              };
          });
          setUpgradeChance(upgradeChanceArray);
          
        } catch (error) {
    
        }
      };

    // A fejlesztés céljának kiválasztása
    const winSelectedItems = (itemId) => {
        setWinSelection(itemId);
        upgradeChance.forEach(element => {
            if (element.itemId === itemId) {
                 setChance(element.chance * 100);     
            } 
        });
    }

    // Az 'UPGRADE' gomb lenyomásának figyelés, a fejlesztés elindítása
    const handleUpgrade = async () => {
        setWinSelection(false);
        try {
            
            const response = await axios({
                method: 'post',
                url: `${API_URL}/items/upgrade`,
                headers: {
                    'Authorization': `Bearer ${store.getState().auth.accessToken}`,
                    'Content-Type': 'application/json'
                },
                data: {
                    Items: selectedItems,
                    Multiplier: 1,
                    Target: winSelection
                }
            });
            setIsSuccess(response.data.success);
            setSpinTrigger(true);
        } catch (error) {
            
        }
    }

    // Minden visszaállítása default-ra
    useEffect (() => {
        fetchProfile()
            .then(success => {
                if (success) {
                    const { profile, inventory } = store.getState().data;
                    dispatch(setProfile(profile));
                    dispatch(setInventory(inventory));
                }
            });
            setItemAccepted(false);
            setSelectedItems([]);
    }, [dispatch, itemAccepted == true])

    return (
        <div style={{width:"100%"}}>
            <Text size='90px' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                Skin Upgrader
            </Text>
            <FortuneWheel number={chance} spinTrigger={spinTrigger} resetSpinTrigger={resetSpinTrigger} success={isSuccess} setOpenModal={setOpenModal}/>
            <Center>
                <Grid align='center' justify="center">
                    <Grid.Col span={5}>
                        <Center>
                            <Card className="upgrdcard" shadow="sm" padding="lg" radius="md" withBorder style={{ textAlign: 'center', minHeight: "calc(380px - 1.5rem)" }}>
                                <Text size='20px' fw={700}   tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                                    A te tárgyaid, {profile.userName} ({inventory.length} db)
                                </Text> 
                                <Space h="xs"></Space>
                                <Group justify="space-between">
                                    <TextInput placeholder="Keresés" classNames={{ input: 'regpage' }} onChange={event => setSearchTerm(event.currentTarget.value)} />
                                </Group>
                                <Space h="xs"></Space>
                                <Grid gutter="lg" direction="row" style={{overflowY: 'auto', overflowX: 'hidden'}}>
                                    <InventorySearchWrapper searchTerm={searchTerm} items={[...inventory].sort((a, b) => b.itemRarity - a.itemRarity)} onToggleItem={toggleItemSelection}/>
                                </Grid>
                            </Card>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Center>
                            <Space h="xl"></Space>
                            <Button fullWidth
                                    variant="gradient"
                                    style={{ marginTop: 20 }}
                                    onClick={triggerSpin}
                                    disabled={!winSelection}
                            >
                                UPGRADE
                            </Button>
                        </Center>
                        <Space h="xs"></Space>
                        <Center>
                            <Link to="/upgrader">
                                <Button fullWidth
                                        variant="gradient"
                                        style={{ marginTop: 20 }}
                                        onClick={() => {
                                            
                                        }}
                                >
                                    Balance upgrade
                                </Button>
                            </Link>
                        </Center>
                    </Grid.Col>
                    <Grid.Col span={5}>
                        <Center>
                            <Card className="upgrdcard2" shadow="sm" padding="lg" radius="md" withBorder style={{ textAlign: 'center', minHeight: "calc(380px - 1.5rem)" }}>
                                <Text size='20px' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                                    Lehetséges nyeremények
                                </Text>
                                <Space h="xs"></Space>
                                <Group justify="space-between">
                                    <TextInput placeholder="Keresés" classNames={{ input: 'regpage' }} onChange={event => setSearchTerm(event.currentTarget.value)} />
                                </Group>
                                <Space h="xs"></Space>
                                {selectedItems.length > 0 && (
                                  <Grid gutter="lg" direction="row" style={{overflowY: 'auto', overflowX: 'hidden'}}>
                                      <InventorySearchWrapper searchTerm={searchTerm} items={[...allItems].sort((a, b) => b.itemRarity - a.itemRarity)} showChance={true} chances={upgradeChance} onToggleItem={winSelectedItems}/>
                                  </Grid>
                              )}
                            </Card>
                        </Center>
                    </Grid.Col>
                </Grid>
            </Center>
            <Modal
                title = {isSuccess ? "Sikeres fejlesztés!" : "A fejlesztés sikertelen!"}
                opened = {openModel}
                onClose={() => setOpenModal(false)}
            >
                {isSuccess ? (
                <>
                    <Text>Nyereményed: {winSelection}</Text>
                    <Button onClick={() => {
                        setItemAccepted(true);
                        setOpenModal(false);
                }}>OK</Button>
                </>) : (
                <>
                    <Text>Sok szerencsét legközelebb!</Text>
                    <Button onClick={() => {
                        setItemAccepted(true);
                        setOpenModal(false);
                    }}>OK</Button>
                </>)}
            </Modal>
        </div>
    );
};

export default MultiplierWheel;

import React, { useState, useEffect, useCallback } from 'react';
import { Button, Text, Slider, Card, Input, Space, Group, TextInput, Grid, Center } from '@mantine/core';
import FortuneWheel from '../components/FortuneWheel';
import { useSelector } from "react-redux";
import InventorySearchWrapper from "../components/InventorySearchWrapper";
import {Link} from 'react-router-dom';
import axios from 'axios';
import store from '../store';
import { API_URL } from '../settings';

const MultiplierWheel = () => {
    const { profile, inventory } = useSelector(state => state.data); 
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ allItems, setAllItems ] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [upgradeChance, setUpgradeChance] = useState([]);
    const [spinTrigger, setSpinTrigger] = useState(false);

    const triggerSpin = useCallback(() => {
        setSpinTrigger(true);
    }, []);

    const resetSpinTrigger = useCallback(() => {
        setSpinTrigger(false);
    }, []);

    const chance = 0;

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
        console.log(upgradeChanceArray);
      } catch (error) {
  
      }
    };

    return (
        <div style={{width:"100%"}}>
            <Text size='90px' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                Skin Upgrader
            </Text>
            <FortuneWheel number={chance} spinTrigger={spinTrigger} resetSpinTrigger={resetSpinTrigger} />
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
                                      <InventorySearchWrapper searchTerm={searchTerm} items={[...allItems].sort((a, b) => b.itemRarity - a.itemRarity)} showChance={true} chances={upgradeChance}/>
                                  </Grid>
                              )}
                            </Card>
                        </Center>
                    </Grid.Col>
                </Grid>
            </Center>
        </div>
    );
};

export default MultiplierWheel;

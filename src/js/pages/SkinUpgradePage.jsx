import React, { useState, useEffect, useCallback } from 'react';
import { Button, Text, Slider, Card, Input, Space, Group, TextInput, Grid, Center } from '@mantine/core';
import FortuneWheel from '../components/FortuneWheel';
import { useSelector } from "react-redux";
import InventorySearchWrapper from "../components/InventorySearchWrapper";
import {Link} from 'react-router-dom';
import { fetchEndpoint } from '../Globals';

const MultiplierWheel = () => {
    const { profile, inventory } = useSelector(state => state.data);
    const [amount, setAmount] = useState(profile.userBalance);
    const [winningAmount, setWinningAmount] = useState(profile.userBalance * 50); 
    const [ searchTerm, setSearchTerm ] = useState('');
    const [ allItems, setAllItems ] = useState([]);

    const [spinTrigger, setSpinTrigger] = useState(false);

    const triggerSpin = useCallback(() => {
        setSpinTrigger(true);
    }, []);

    const resetSpinTrigger = useCallback(() => {
        setSpinTrigger(false);
    }, []);

    useEffect(() => {
      fetchItems = async () => {
        var items = (await fetchEndpoint("items")).data;
        setAllItems(items);
      }

      fetchItems();
    }, []);

    // Esély kiszámítása
    const chance = (0.75 + (winningAmount - (amount + 0.1)) / (amount * 50 - (amount + 0.1)) * (0.01 - 0.75)) * 100;

    const handleAmountChange = (value) => {
        setAmount(value); 
        setWinningAmount(amount + 0.1); // Nyeremény csúszka ugrása a minimumhoz
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
            <InventorySearchWrapper searchTerm={searchTerm} items={[...inventory].sort((a, b) => b.itemRarity - a.itemRarity)} />
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
                    A mi tárgyaink
                    </Text>
                    <Space h="xs"></Space>
                    <Group justify="space-between">
            <TextInput placeholder="Keresés" classNames={{ input: 'regpage' }} onChange={event => setSearchTerm(event.currentTarget.value)} />
          </Group>
          <Space h="xs"></Space>
          <Grid gutter="lg" direction="row" style={{overflowY: 'auto', overflowX: 'hidden'}}>
            <InventorySearchWrapper searchTerm={searchTerm} items={[...allItems].sort((a, b) => b.itemRarity - a.itemRarity)} />
          </Grid>
                </Card>
                </Center>
      </Grid.Col>
                </Grid>
                </Center>
                </div>
    );
};

export default MultiplierWheel;
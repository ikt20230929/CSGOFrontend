import React, { useState } from 'react';
import { Button, Text, Slider, Card, Input, Space } from '@mantine/core';
import FortuneWheel from '../components/FortuneWheel';
import { useSelector } from "react-redux";
import {Link} from 'react-router-dom';

const MultiplierWheel = () => {
    const { profile } = useSelector(state => state.data);
    const [amount, setAmount] = useState(profile.userBalance);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [winningAmount, setWinningAmount] = useState(profile.userBalance * 50); 

    // Esély kiszámítása
    const chance = (0.75 + (winningAmount - (amount + 0.1)) / (amount * 50 - (amount + 0.1)) * (0.01 - 0.75)) * 100;

    const handleAmountChange = (value) => {
        setAmount(value); 
        setWinningAmount(amount + 0.1); // Nyeremény csúszka ugrása a minimumhoz
    };

    return (
        <div>
            
                <Text size='90px' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                    Upgrader
                </Text>
                <FortuneWheel number={chance}/>
                <Card className="upgrdcard" shadow="sm" padding="lg" radius="md" withBorder style={{ textAlign: 'center', minHeight: "calc(380px - 1.5rem)" }}>
                <div style={{ textAlign: 'center', marginTop: 10 }}>
                    <Text>Befizetni kívánt összeg:</Text>
                    <Slider
                        className='sliders'
                        min={0.1}
                        max={profile.userBalance} 
                        value={amount}
                        onChange={handleAmountChange}
                        step={0.1} 
                    />
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(parseFloat(e.target.value))} 
                        classNames={{ input: 'upgradeinput' }}
                        step={0.1} 
                    />
                    <Text>Nyeremény mennyisége:</Text>
                    <Slider
                        className='sliders'
                        min={amount + 0.1}
                        max={amount * 50} // Befizetett összeg 50x-ese
                        value={winningAmount}
                        onChange={setWinningAmount}
                        step={0.1} 
                    />
                    <Input
                        type="number"
                        value={winningAmount}
                        onChange={(e) => setWinningAmount(parseFloat(e.target.value))} 
                        classNames={{ input: 'upgradeinput' }}
                        step={0.1} 
                    />
                    <Button
                        variant="gradient"
                        style={{ marginTop: 20 }}
                        onClick={() => {
                            
                        }}
                    >
                        UPGRADE
                    </Button>
                    <Space h="xs"></Space>
                    <Link to="/skinupgrade">
                    <Button
                        variant="gradient"
                        style={{ marginTop: 20 }}
                        onClick={() => {
                            
                        }}
                    >
                        Skin upgrade
                    </Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default MultiplierWheel;

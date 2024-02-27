import React, { useState } from 'react';
import { Button, Text, Input, Badge, Progress, Card, Space } from '@mantine/core';
import FortuneWheel from '../components/FortuneWheel';

const MultiplierWheel = () => {
    const [selectedMultiplier, setSelectedMultiplier] = useState(2);
    const [amount, setAmount] = useState(100);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);
    const [rotationDeg, setRotationDeg] = useState(0);
    const [stopPosition, setStopPosition] = useState(null);
    const [inputValue, setInputValue] = useState(""); // Új state változó az input mező értékének tárolására

    const winningChances = { 2: 60, 5: 30, 10: 15, 20: 7.5 };

    const spinWheel = () => {
        setSpinning(true);
        const winningChance = winningChances[selectedMultiplier];
        const randomNum = Math.random() * 100;
        const won = randomNum <= winningChance;
        const winAmount = won ? selectedMultiplier * amount : 0;

        setTimeout(() => {
            setResult({
                won: won,
                amount: winAmount
            });
            setSpinning(false);
            setRotationDeg(rotation);
            setStopPosition(stopPosition);
        }, 3000); // Simulate spinning delay
    };

    const handleMultiplierChange = (multiplier) => {
        setSelectedMultiplier(multiplier);
    };

    const getWheelStyle = () => {
        const winningChance = winningChances[selectedMultiplier];
        const rotation = (360 / 100) * (100 - winningChance);
        return { transform: `rotate(${rotation}deg)` };
    };

    return (
        <div>
            <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ textAlign: 'center', minHeight: "calc(100vh - 3.5rem)" }}>
                <Text size='90px' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                    Upgrader
                </Text>
                <FortuneWheel />
                <div style={{ textAlign: 'center' }}>
                    <Text>Befizetni kívánt összeg:</Text>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, marginBottom: 10 }}>
                        <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            disabled={spinning}
                            classNames={{ input: 'regpage' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                        <Button onClick={() => handleMultiplierChange(2)}>2x</Button>
                        <Button onClick={() => handleMultiplierChange(5)}>5x</Button>
                        <Button onClick={() => handleMultiplierChange(10)}>10x</Button>
                        <Button onClick={() => handleMultiplierChange(20)}>20x</Button>
                    </div>

                    <div style={{ marginTop: 10 }}>
                        <Text>Választott szorzó: {selectedMultiplier}x</Text>
                        <Text>Várható nyeremény: {amount * selectedMultiplier}</Text>
                        <Text>Esélyed: {winningChances[selectedMultiplier]}%</Text>
                        <Progress classNames={{ root: 'regpage' }} value={winningChances[selectedMultiplier]} max={100} />
                        <Badge color={result && result.won ? 'green' : 'red'}>
                            {result && result.won ? 'Nyertél' : 'Vesztettél'}
                        </Badge>
                        <Text>Ennyit nyertél: {result && result.amount}</Text>
                    </div>

                    <Button
                        variant="gradient"
                        onClick={spinWheel}
                        disabled={spinning}
                    >
                        UPGRADE
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default MultiplierWheel;

import React, { useState } from 'react';
import { Button, Text, Input, Badge, Progress, Card, Group, Space, Center } from '@mantine/core';
import CenteredContainer from "../components/CenteredContainer";

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
            <FortuneWheel />
            <CenteredContainer size="xl">
                <Card className="regpage" shadow="sm" padding="lg" radius="md">
                    <Group justify="space-between" mt="lg" mb="xs">
                        <Text size='90px' fw={700} tt="uppercase" variant="gradient"
                            gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>Upgrader</Text>
                    </Group>
                    <Space h="xl" />
                </Card>

                <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ width: "30vw" }}>
                    <Center>
                    <Text>Befizetni kívánt összeg:</Text>
                    </Center>
                    <Space h="sm"></Space>
                    <Center>
                    <Input
                    type="number"
                    min={1}
                    max={1000}
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    disabled={spinning}
                    classNames={{ input: 'regpage' }}
                    style={{ width: 100 }}
                />
                </Center>
                    <Space h="sm" />
                    <div style={{ textAlign: 'center', maxWidth: 500, margin: 'auto' }}>
                        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            {[2, 5, 10, 20].map(multiplier => (
                                <Button
                                    key={multiplier}
                                    onClick={() => handleMultiplierChange(multiplier)}
                                    variant={selectedMultiplier === multiplier ? 'gradient' : 'outline'}
                                    style={{ marginRight: 10 }}
                                    gradient={{ from: 'rgba(255, 255, 255, 0.3)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}
                                >
                                    {multiplier}x
                                </Button>
                            ))}
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <Text>Választott szorzó: {selectedMultiplier}x</Text>
                            <Text>Várható nyeremény: {amount*selectedMultiplier}</Text>
                            <Text>Esélyed: {winningChances[selectedMultiplier]}%</Text>
                            <Progress classNames={{ root: 'regpage' }} color='rgba(99, 234, 255, 1)' value={winningChances[selectedMultiplier]} animated max={100} />
                            <Badge color={result && result.won ? 'green' : 'red'}>{result && result.won ? 'Nyertél' : 'Vesztettél'}</Badge>
                            <Text>Ennyit nyertél: {result && result.amount}</Text>
                        </div>
                        <Button variant="gradient"
                            gradient={{ from: 'rgba(255, 255, 255, 0.3)', to: 'rgba(99, 234, 255, 1)', deg: 90 }} onClick={spinWheel} disabled={spinning || amount === "" || amount === "0" || amount<0 || amount === "-0"} style={{ marginTop: 10 }}>
                            UPGRADE
                        </Button>
                    </div>
                </Card>
            </CenteredContainer>
        </div>
    );
};

export default MultiplierWheel;

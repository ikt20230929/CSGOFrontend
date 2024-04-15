import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Card, Group, Text, Space, Badge, Notification, Button } from "@mantine/core";
import { useSelector } from 'react-redux';
import { fetchEndpoint, fetchProfile } from '../Globals';

export default function LoginStreak() {
    const { profile } = useSelector(state => state.data);

    const startOfMonth = dayjs().startOf('month');
    const daysInMonth = startOfMonth.daysInMonth();
    const todayDate = dayjs().date();
    const firstDayIndex = startOfMonth.day();

    const monthDays = Array.from({ length: firstDayIndex }, () => null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const [claimSuccess, setClaimSuccess] = useState(false);
    const [alreadyClaimedToday, setAlreadyClaimedToday] = useState(dayjs(profile.userLastClaimDate).isSame(dayjs(), 'day'));
    const [amount, setAmount] = useState(0);

    // Responsivity
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleButtonClick = async () => {
        var result = await fetchEndpoint('daily');

        if (result.success) {
            setClaimSuccess(true);
            setAmount(result.data.message);
            setAlreadyClaimedToday(true);
        }

        await fetchProfile();
    };

    return (
        <>
            {claimSuccess && (
                <Notification withCloseButton={false} className='alerteles regpage' withBorder color="cyan" radius="lg" title="Sikeresen kiváltottad a napi jutalmad!">
                    A mai jutalmad: ${amount}!<br />Gyere vissza holnap is!
                </Notification>
            )}
            <div className='loginstreak'>
                <Card className="streak" shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mt="lg" mb="xs">
                        <Text fw={900} size="5vw" tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                            Napi bejelentkezési bónuszod
                        </Text>
                        <Badge color="pink">Gyere vissza minden nap!</Badge>
                    </Group>
                    <Space h="lg"></Space>

                    {windowWidth > 1300 ? (
                        // Current View
                        <div className="calendar-grid">
                            {monthDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`calendar-cell ${day !== null ? 'active' : 'hidden'} ${day !== todayDate || alreadyClaimedToday ? 'past' : 'today'}`}
                                    onClick={!alreadyClaimedToday && day === todayDate ? handleButtonClick : undefined}
                                >
                                    {day !== null && day}
                                </div>
                            ))}
                        </div>
                    ) : (
                        // New View, containing only a button
                        <div>
                            <Button variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90 }} onClick={handleButtonClick}><img width="20px" style={{marginRight: "5px"}} src='/assets/treasure.png'></img>Napi jutalom kiváltása</Button>
                        </div>
                    )}
                </Card>
            </div>
        </>
    );
}

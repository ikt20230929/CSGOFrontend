import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Card, Group, Text, Space, Badge, Notification } from "@mantine/core";
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

    const handleButtonClick = async () => {
        var result = await fetchEndpoint('daily');

        if (result.success) {
            setClaimSuccess(true);
            setAmount(result.data.amount);
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
                <Card className="logpage" shadow="sm" padding="lg" radius="md" withBorder>
                    <Group justify="space-between" mt="lg" mb="xs">
                        <Text fw={900} size="5vw" tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                            Napi bejelentkezési bónuszod
                        </Text>
                        <Badge color="pink">Gyere vissza minden nap!</Badge>
                    </Group>
                    <Space h="lg"></Space>
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
                </Card>
            </div>
        </>
    );
}
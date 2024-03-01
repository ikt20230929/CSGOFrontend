import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/hu';
import { Card, Group, Text, Space, Badge, Notification } from "@mantine/core";
import CenteredContainer from '../components/CenteredContainer';

dayjs.locale('hu');

export default function LoginStreak() {
    const startOfMonth = dayjs().startOf('month');
    const daysInMonth = startOfMonth.daysInMonth();
    const todayDate = dayjs().date();
    const firstDayIndex = startOfMonth.day();

    const monthDays = Array.from({ length: firstDayIndex }, () => null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    const [userClicked, setUserClicked] = useState([]);
    const [claimSuccess, setClaimSuccess] = useState(false);

    const handleButtonClick = (day) => {
        if (day === todayDate) {
            setUserClicked([...userClicked, day]);
            setClaimSuccess(true);
        }
    };

    return (
        <>
            {claimSuccess && (
    <Notification  withCloseButton={false} className='alerteles' withBorder color="cyan" radius="lg" title="Sikeresen kiváltottad a napi jutalmad!">
    Gyere vissza holnap is!
  </Notification>
            )}
        <div className='loginstreak'>
            <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mt="lg" mb="xs">
                    <Text fw={900} size="50px" tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                        Napi bejelentkezési bónuszod
                    </Text>
                    <Badge color="pink">Gyere vissza minden nap!</Badge>
                </Group>
                <Space h="lg"></Space>
                <div className="calendar-grid">
                    {monthDays.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-cell ${day !== null ? 'active' : 'hidden'} ${userClicked.includes(day) ? 'claimed' : ''} ${
                                day === todayDate ? 'today' : 'past'
                            }`}
                            onClick={() => handleButtonClick(day)}
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

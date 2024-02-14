import React, { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/hu';
import { Card, Group, Text, Space, Badge, Notification } from "@mantine/core"; 

dayjs.locale('hu');

export default function LoginStreak() {
    const startOfMonth = dayjs().startOf('month');
    const daysInMonth = startOfMonth.daysInMonth();
    const todayDate = dayjs().date();
    const firstDayIndex = startOfMonth.day();

    let monthDays = [];
    for (let i = 0; i < firstDayIndex; i++) {
        monthDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        monthDays.push(i);
    }

    const [userClicked, setUserClicked] = useState([]);
    const [claimSuccess, setClaimSuccess] = useState(false);

    const handleButtonClick = (day) => {
        if (day === todayDate) {
            setUserClicked([...userClicked, day]);
            setClaimSuccess(true);
        }
    };

    return (
        <div>
            <div>
            {claimSuccess &&<Notification color="lime" radius="lg" title="Sikeresen kiváltottad a napi jutalmad!" mt="md">Gyere vissza holnap is!</Notification>}
            </div>
            <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
                <Group justify="space-between" mt="lg" mb="xs">
                    <Text fw={900} size="50px" tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>Napi bejelentkezési bónuszod</Text>
                    <Badge color="pink">Gyere vissza minden nap!</Badge>
                </Group>
                <Space h="lg"></Space>
                <div className="calendar-grid">
                    {monthDays.map((day, index) => (
                        <div
                            key={index}
                            className={`calendar-cell ${day !== null ? 'active' : 'hidden'} ${userClicked.includes(day) ? 'claimed' : ''} ${day === todayDate ? 'today' : ''}`}
                            onClick={() => handleButtonClick(day)}
                        >
                            {day !== null && day}

                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

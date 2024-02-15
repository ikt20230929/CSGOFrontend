import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { TextInput, Radio, Checkbox, Card, Text, Badge, Button, Group, Space } from '@mantine/core';
import { NavLink, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchEndpoint } from '../Globals';
var localizedFormat = require('dayjs/plugin/localizedFormat')
require('dayjs/locale/hu')
dayjs.extend(localizedFormat)
dayjs.locale("hu");

export default function GiveawayPage() {
  const [currentGiveaways, setCurrentGiveaways] = useState([]);
  const [pastGiveaways, setPastGiveaways] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const currentGiveawaysResponse = (await fetchEndpoint("giveaways/current")).data;
      if (currentGiveawaysResponse == null) {
        navigate("/login");
        return;
      }
      
      const pastGiveawaysResponse = (await fetchEndpoint("giveaways/past")).data;
      if (pastGiveawaysResponse == null) {
        navigate("/login");
        return;
      }

      setCurrentGiveaways(currentGiveawaysResponse);
      setPastGiveaways(pastGiveawaysResponse);
    }
    fetchData();
  }, []);

  const [userClicked, setUserClicked] = useState([]);
  const [joinSuccess, setJoinSuccess] = useState(false);

  const handleButtonClick = (index, type) => {
    setUserClicked([...userClicked, index]);
    setJoinSuccess(true);
  };
  return (
    <div>
        <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
        <Group justify="space-between" mt="lg" mb="xs">
          <Text size='90px' fw={700} tt="uppercase" variant="gradient"
      gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90  }}>Futó nyereményjátékok</Text>
          <Badge color="pink">Közjegyző által hitelesítve</Badge>
        </Group>
        <Space h="xl" />
      <div>
        {currentGiveaways.map(giveaway => {
            return (
              <div key={giveaway.giveawayId}>
                    <Text size='l' fw={700} tt="uppercase">{giveaway.giveawayName}</Text>
                    <Text c="dimmed">Nyeremény: {giveaway.item}</Text>
                    <Text c="dimmed">Sorsolás lejárta: {dayjs(giveaway.giveawayDate).format('LLL')}</Text>
                    <Space h="sm" />
                    {userClicked.includes(giveaway.giveawayId) ? (
                          <Button disabled
                        >
                          Már csatlakoztál ehhez a nyereményjátékhoz!
                        </Button>
                        ) : (
                                <Button onClick={() => handleButtonClick(giveaway.giveawayId)}
                                  variant="gradient"
                                  gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90 }}
                                >
                                  Csatlakozás!
                                </Button>
                                
                    )}
                          <Space h="md" />
              </div>
            );
          })}
      </div>
      <Space h="lg" />
      <Text size='30px' fw={700} tt="uppercase" variant="gradient"
      gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(143, 143, 143, 1)', deg: 90  }}>Korábbi nyertesek</Text>
      {/*Last 3 winners of each type*/}
      </Card>
    </div>
  );
}
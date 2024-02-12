import React, { useState } from 'react';
import moment from 'moment';
import { TextInput, Radio, Checkbox, Card, Text, Badge, Button, Group, Space } from '@mantine/core';
import { NavLink, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
//import 'moment/dist/locale/hu';

moment.locale('hu');

const giveAwayDatas = [
  {Napi: {
    item: "AK-47 | Example Skin",
    drawTime: moment().hour(19).minute(0).format("LLL")
  }},
  {Heti: {
    item: "AWP | Example Skin",
    drawTime: moment().day(6).hour(20).minute(0).format("LLL")
  }},
  {Havi: {
    item: "Karambit | Marble Example",
    drawTime: moment().date(28).hour(20).minute(30).format("LLL")
  }}
];

function GiveawayPage() {

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
      gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(143, 143, 143, 1)', deg: 90  }}>Futó nyereményjátékok</Text>
          <Badge color="pink">Közjegyző által hitelesítve</Badge>
        </Group>
        <Space h="xl" />
      <div>
        {giveAwayDatas.map((giveAwayData, index) => {
            const giveawayType = Object.keys(giveAwayData)[0];
            const { item, drawTime } = giveAwayData[giveawayType];
            return (
              <div>
                    <Text size='l' fw={700} tt="uppercase">{giveawayType} nyereményjáték</Text>
                    <Text c="dimmed">Nyeremény: {item}</Text>
                    <Text c="dimmed">Sorsolás lejárta: {drawTime}</Text>
                    <Space h="sm" />
                    {userClicked.includes(index) ? (
                          <Button disabled
                        >
                          Már csatlakoztál ehhez a nyereményjátékhoz!
                        </Button>
                        ) : (
                                <Button onClick={() => handleButtonClick(index)}
                                  variant="gradient"
                                  gradient={{ from: 'lime', to: 'yellow', deg: 90 }}
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

export default GiveawayPage;
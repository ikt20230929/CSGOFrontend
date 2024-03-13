import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { Card, Text, Badge, Button, Group, Space } from '@mantine/core';
import { useNavigate } from "react-router-dom";
import { fetchEndpoint } from '../Globals';
import axios from 'axios';
import { API_URL } from '../settings';
import { useSelector } from 'react-redux';
var localizedFormat = require('dayjs/plugin/localizedFormat')
require('dayjs/locale/hu')
dayjs.extend(localizedFormat)
dayjs.locale("hu");

export default function GiveawayPage() {
  const accessToken = useSelector(state => state.auth).accessToken;
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


  const handleButtonClick = async (index) => {
    var response = await axios.post(`${API_URL}/giveaways/${index}`, {}, {
      headers: {
        'Authorization': `Bearer ${accessToken}`

      }
    })
    if (response.status == 204) {
      setCurrentGiveaways(currentGiveaways.map(giveaway => {
        if (giveaway.giveawayId == index) {
          giveaway.giveawayJoined = true;
        }
        return giveaway;
      }));
    }
  };
  return (
    <div>
        <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{minHeight: "calc(100vh - 3.5rem)"}}>
        <Text size='90px' fw={700} tt="uppercase" variant="gradient"
      gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90  }}>Futó nyereményjátékok</Text>
        <Space h="xl" />
      <div>
        {currentGiveaways.length == 0 ? <h2>Jelenleg nem fut egy nyereményjáték sem...</h2> : currentGiveaways.map(giveaway => {
            return (
              <div key={giveaway.giveawayId}>
                    <Text size='l' fw={700} tt="uppercase">{giveaway.giveawayName}</Text>
                    <Text c="dimmed">Nyeremény: {giveaway.giveawayItem}</Text>
                    <Text c="dimmed">Sorsolás lejárta: {dayjs(giveaway.giveawayDate).format('LLL')}</Text>
                    <Space h="sm" />
                    {giveaway.giveawayJoined ? (
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
      {pastGiveaways.length == 0 ? <h2>Még senki sem nyert, légy te az első!</h2> : pastGiveaways.map(giveaway => {
            return (
              <div key={giveaway.giveawayId}>
                    <Text size='l' fw={700} tt="uppercase">{giveaway.giveawayName}</Text>
                    <Text c="dimmed">Nyeremény: {giveaway.giveawayItem}</Text>
                    <Text c="dimmed">Sorsolás lejárta: {dayjs(giveaway.giveawayDate).format('LLL')}</Text>
                    <Text c="dimmed">Nyertes: {giveaway.winnerName}</Text>
                    <Space h="md" />
              </div>
            );
          })}
      </Card>
    </div>
  );
}
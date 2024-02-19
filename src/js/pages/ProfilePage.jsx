import React, { useEffect, useState } from "react";
import { fetchEndpoint } from "../Globals";
import { useNavigate } from "react-router-dom";
import { Card, Group, Text, Space, Modal, Button, TextInput, FileInput, Loader } from "@mantine/core";
import { Popover, Select } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    profile: [],
    inventory: []
  });
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(true);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  useEffect(() => {
    const fetchData = async () => {
      const profileResponse = (await fetchEndpoint("profile")).data;
      if (profileResponse == null) {
        navigate("/login");
        return;
      }

      const inventoryResponse = (await fetchEndpoint("inventory")).data;
      if (inventoryResponse == null) {
        navigate("/login");
        return;
      }
      
      const casesResponse = (await fetchEndpoint("cases")).data;
      if (casesResponse == null) {
        navigate("/login");
        return;
      }
      
      setProfileData({
        profile: profileResponse,
        inventory: inventoryResponse
      });

      setCaseData(casesResponse);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader color="rgba(0, 102, 255, 1)" size="xl" type="bars" />
        </div>
      ) : (
        <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{minHeight: "calc(100vh - 3.5rem)"}}>
          <Group justify="space-between" mt="lg" mb="xs">
            <Text size='90px' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(143, 143, 143, 1)', deg: 90 }}>
              {profileData.profile.username} profilja
            </Text>
          </Group>
          <Space h="sm"/>
          <Text size="xl">Egyenleged: {formatCurrency(profileData.profile.balance)}</Text>
          <Space h="xl" />
          <Modal opened={opened} onClose={close} title="Adataid szerkesztése" transitionProps={{ transition: 'fade', duration: 600, timingFunction: 'linear' }}>
            <TextInput label="Steam URL módosítása" placeholder="https://steamcommunity.com/tradeoffer/new/?partner=yourowntoken" />
            <TextInput label="Partner kód" placeholder="FREE3USD" />
            <FileInput variant="filled" label="Profilkép" description="Válassz magadnak egy új profilképet!" placeholder="Katt!" />
            <Space h="md" />
            <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={close}>
              Mentés
            </Button>
          </Modal>
          <Button onClick={open} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
            Adatok módosítása
          </Button>

          <h2 className="welcome">Megszerzett tárgyak: ({profileData.inventory.length} db)</h2>
          {profileData.inventory.map(item => {
            return (
              <div key={item.id} data-cy="inventory-item">
                {}
              </div>
            );
          })}

          <h2 className="welcome">Összes láda: ({caseData.length} db)</h2>
          {caseData.map(_case => {
            return (
              <div key={_case.caseId} data-cy="case">
                <h1>{_case.caseName} (has {_case.items.length} items)</h1>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}

import React from "react";
import { Card, Group, Text, Space, Modal, Button, TextInput, FileInput } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useSelector } from "react-redux";

export default function ProfilePage() {
  const { profile, inventory, cases } = useSelector(state => state.data);
  const [opened, { open, close }] = useDisclosure(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  }

  return (
    <div>
        <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{minHeight: "calc(100vh - 3.5rem)"}}>
          <Group justify="space-between" mt="lg" mb="xs">
            <Text size='90px' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(143, 143, 143, 1)', deg: 90 }}>
              {profile.username} profilja
            </Text>
          </Group>
          <Space h="sm"/>
          <Text size="xl">Egyenleged: {formatCurrency(profile.balance)}</Text>
          <Space h="xl" />
          <Modal opened={opened} onClose={close} title="Adataid szerkesztése" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
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

          <h2 className="welcome">Megszerzett tárgyak: ({inventory.length} db)</h2>
          {inventory.map(item => {
            return (
              <div key={item.id} data-cy="inventory-item">
                {}
              </div>
            );
          })}
        </Card>
    </div>
  );
}

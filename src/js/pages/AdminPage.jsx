import React, { useState } from "react";
import { Card, Group, Text, Space, Modal, Button, TextInput, FileInput, Grid, Badge, NumberFormatter } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { useSelector } from "react-redux";
import CenteredContainer from "../components/CenteredContainer";

export default function ProfilePage() {
  const { profile, inventory } = useSelector(state => state.data);
  const [opened, { open, close }] = useDisclosure(false);
  const { cases } = useSelector(state => state.data);

  const handleCaseClick = (caseId) => {
    window.location.href = `/casepage/${caseId}`;
  };


  return (
    <div>
        <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{minHeight: "calc(100vh - 3.5rem)"}}>
          <Group justify="space-between" mt="lg" mb="xs">
            <Text size='90px' fw={700} tt="uppercase" variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(143, 143, 143, 1)', deg: 90 }}>
              {profile.userName} ADMIN
            </Text>
          </Group>
          <Space h="sm"/>
          <Text size="xl">Egyenleged: <NumberFormatter prefix="$" fixedDecimalScale={true} decimalScale={2} value={profile.userBalance} /></Text>
          <Space h="xl" />
          <Modal opened={opened} onClose={close} title="Új láda adatai" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
            <TextInput label="Név" placeholder="Your Case" />
            <TextInput label="Ár" placeholder="20$" />
            <TextInput label="SkinID" placeholder="10" />
            <FileInput variant="filled" label="Láda képe" description="Válassz az új ládának egy képet!" placeholder="Katt!" />
            <Space h="md" />
            <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={close}>
              Mentés
            </Button>
          </Modal>
          <Button onClick={open} variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}>
            Új láda hozzáadása
          </Button>

          <Modal opened={opened} onClose={close} title="Láda szerkesztése" transitionProps={{ transition: 'pop', duration: 400, timingFunction: 'ease' }}>
            <TextInput label="Név" placeholder="Your Case" />
            <TextInput label="Ár" placeholder="20$" />
            <TextInput label="SkinID" placeholder="10" />
            <FileInput variant="filled" label="Láda képe" description="Válassz az új ládának egy képet!" placeholder="Katt!" />
            <Space h="md" />
            <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 90 }} type="submit" onClick={close}>
              Mentés
            </Button>
          </Modal>

          <CenteredContainer size="xl">
      <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ width: "100vw" }}>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>LÁDÁK SZERKESZTÉSE</Text>
          <Badge color="pink">Összes láda: ({cases.length} db)</Badge>
        </Group>
        <Grid gutter="lg">
          {cases.map(_case => (
            <Grid.Col span={3} key={_case.caseId}>
              <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
                <Text>{_case.caseName}</Text>
                <Text size="sm" color="dimmed">({_case.items.length} db)</Text>
                <Space h="xs"></Space>
                <Button onClick={() => handleCaseClick(_case.caseId)} variant="outline" color="blue">Megtekintés</Button>
                <Space h="xs"></Space>
                <Button onClick={open} variant="outline" color="yellow">Szerkesztés</Button>
                <Space h="xs"></Space>
                <Button variant="outline" color="red">Törlés</Button>
                {/*{_case.items.map(_caseItem => (
                  <Text key={_caseItem.itemId} size="sm" color="dimmed">{_caseItem.itemName} - {_caseItem.itemSkinName} (Ár: {_caseItem.itemSkinValue} $)</Text>
                ))}*/}
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Card>
    </CenteredContainer>
        </Card>
    </div>
  );
}

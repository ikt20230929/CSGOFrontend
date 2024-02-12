import React from "react";
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';

export default function MainPage() {
  return (
    <span style={{width:10}}>

    <Card className="regpage" mt={250} fullWidth shadow="sm" padding="lg" radius="md" withBorder>


      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Válassz az alábbi lehetőségek közül!</Text>
        <Badge color="pink">Adataid biztonságban vannak</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        Ha van már létrehozva fiókod,szopj le
      </Text>
    </Card>

    </span>

  );
}

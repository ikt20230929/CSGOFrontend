import React from "react";
import { Card, Image, Text, Badge, Button, Group } from '@mantine/core';
import { NavLink } from "react-router-dom";

export default function MainPage() {
  return (
    <span style={{width:10}}>

    <Card className="regpage" mt={250} fullWidth shadow="sm" padding="lg" radius="md" withBorder>


      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Válassz az alábbi lehetőségek közül!</Text>
        <Badge color="pink">Adataid biztonságban vannak</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        Ha van már létrehozva fiókod, akkor jelentkezz be, amennyiben pedig még nincs, akkor regisztrálj!
      </Text>

      <NavLink to="/login">
      <Button variant="gradient"
      gradient={{ from: 'indigo', to: 'grape', deg: 89 }}fullWidth mt="md" radius="lg">
        Bejelentkezés
      </Button>
      </NavLink>
      <NavLink to="/register">
      <Button variant="gradient"
      gradient={{ from: 'grape', to: 'indigo', deg: 89 }}fullWidth mt="md" radius="lg">
        Regisztráció
      </Button>
      </NavLink>
    </Card>

    </span>

  );
}

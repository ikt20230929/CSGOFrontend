import React from "react";
import { Card, Text, Badge, Button, Group } from '@mantine/core';
import { NavLink } from "react-router-dom";
import CenteredContainer from "../components/CenteredContainer";

export default function MainPage() {
  return (
    <CenteredContainer size={"xl"}>
      <Card className="logpage" shadow="sm" padding="lg" radius="md" withBorder={true}>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Válassz az alábbi lehetőségek közül!</Text>
          <Badge color="pink">Adataid biztonságban vannak</Badge>
        </Group>

        <Text size="sm" c="dimmed">
          Ha van már létrehozva fiókod, akkor jelentkezz be, amennyiben pedig még nincs, akkor regisztrálj!
        </Text>

        <NavLink to="/login">
          <Button variant="gradient"
            gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90 }} fullWidth={true} mt="md" radius="lg">
            Bejelentkezés
          </Button>
        </NavLink>
        <NavLink to="/register">
          <Button variant="gradient"
            gradient={{ from: 'rgba(99, 234, 255, 0.8)', to: 'rgba(255, 255, 255, 0.2)', deg: 90 }} fullWidth={true} mt="md" radius="lg">
            Regisztráció
          </Button>
        </NavLink>
      </Card>
    </CenteredContainer>
  );
}

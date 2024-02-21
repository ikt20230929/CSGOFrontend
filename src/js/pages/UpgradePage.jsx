import React from "react";
import { Card, Image, Text, Badge, Button, Group, Space, Grid } from '@mantine/core';
import CenteredContainer from "../components/CenteredContainer";

export default function MainPage() {
  return (
    <CenteredContainer size="xl">

    <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ width: "100vw" }}>


      <Group justify="space-between" mt="md" mb="xs">
      <Text size='90px' fw={700} tt="uppercase" variant="gradient"
      gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90  }}>Skin fejlesztés</Text>
      </Group>

      <Text span size="sm" c="dimmed">
        asdasdasdas
      </Text>
      <Grid gutter="xl">
      <Grid.Col span={4}>1</Grid.Col>
      <Grid.Col span={4}>2</Grid.Col>
      <Grid.Col span={4}>3</Grid.Col>
      <Grid.Col span={4}>4</Grid.Col>
      <Grid.Col span={4}>5</Grid.Col>
      <Grid.Col span={4}>6</Grid.Col>
      <Grid.Col span={4}>7</Grid.Col>
      <Grid.Col span={4}>8</Grid.Col>
      <Grid.Col span={4}>9</Grid.Col>
    </Grid>
    </Card>
</CenteredContainer>


  );
}

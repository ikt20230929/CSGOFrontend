import React from "react";
import { Card, Image, Text, Badge, Button, Group, Space, Grid } from '@mantine/core';
import CenteredContainer from "../components/CenteredContainer";

export default function MainPage() {
  return (
    <CenteredContainer size="xl">

    <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ width: "100vw" }}>


      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>Tavaszi ládák</Text>
        <Badge color="pink">Most felkapottak</Badge>
      </Group>

      <Text span size="sm" c="dimmed">
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
      </Text>
    </Card>
</CenteredContainer>


  );
}

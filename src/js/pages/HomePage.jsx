import React from 'react';
import { Card, Text, Badge, Grid, Group } from '@mantine/core';
import CenteredContainer from "../components/CenteredContainer";
import { useSelector } from "react-redux";

export default function MainPage() {
  const { cases } = useSelector(state => state.data);

  const handleCaseClick = (caseId) => {
    window.location.href = `/casepage/${caseId}`;
  };

  return (
    <CenteredContainer size="xl">
      <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ width: "100vw" }}>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Tavaszi ládák</Text>
          <Badge color="pink">Összes láda: ({cases.length} db)</Badge>
        </Group>
        <Grid gutter="lg">
          {cases.map(_case => (
            <Grid.Col span={3} key={_case.caseId} onClick={() => handleCaseClick(_case.caseId)}>
              <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
                <Text>{_case.caseName}</Text>
                <Text size="sm" color="dimmed">({_case.items.length} items)</Text>
                {_case.items.map(_caseItem => (
                  <Text key={_caseItem.itemId} size="sm" color="dimmed">({_caseItem.itemName} - {_caseItem.itemSkinName})</Text>
                ))}
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Card>
    </CenteredContainer>
  );
}

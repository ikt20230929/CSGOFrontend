import React, { useState } from 'react';
import { Card, Text, Badge, Grid, Group } from '@mantine/core';
import { useSelector } from "react-redux";
import { API_URL } from '../settings';

export default function MainPage() {
  const { cases } = useSelector(state => state.data);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleCaseClick = (caseId) => {
    window.location.href = `/casepage/${caseId}`;
  };

  const handleMouseEnter = (caseId) => {
    setHoveredCard(caseId);
  };

  const handleMouseLeave = () => {
    setHoveredCard(null);
  };

  return (
      <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder style={{ width: "100%", maxWidth: "100%" }}>
        <Group justify="space-between" mt="md" mb="xs">
          <Text fw={500}>Tavaszi ládák</Text>
          <Badge color="pink">Összes láda: ({cases.length} db)</Badge>
        </Group>
        <Grid gutter="lg">
          {cases.map(_case => (
            <Grid.Col span={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={_case.caseId} onClick={() => handleCaseClick(_case.caseId)}>
              <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder onMouseEnter={() => handleMouseEnter(_case.caseId)}
              onMouseLeave={handleMouseLeave} style={{ 
                cursor: 'pointer', 
                border: hoveredCard === _case.caseId ? '1px solid aqua' : '1px solid #cbd5e0' ,
                width: "100%", maxWidth: "100%"
              }}>
                <img style={{margin:"auto"}} width="300vh" src={`${API_URL}${_case.itemAssetUrl}`}></img>
                <Text>{_case.caseName}</Text>
                <Text size="sm" color="dimmed">({_case.items.length} db)</Text>
                <Text size="sm" color="dimmed" fw={500}>{_case.itemValue} $</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Card>
  );
}

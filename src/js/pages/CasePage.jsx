import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Text, Button, Grid, Center, Space } from '@mantine/core';

function CasePage() {
  const { caseId } = useParams();
  const cases = useSelector((state) => state.data).cases;
  const [caseData, setCaseData] = useState({
      caseName: '',
      items: []
  });
  const [navigateAway, setNavigateAway] = useState(false);

  useEffect(() => {
      let item = cases.find((item) => item.caseId == caseId);

      if (!item) {
          setNavigateAway(true);
      }

      setCaseData(item);
  }, []);

  return (
    <div>
        <Space h="sm"/>
        <Text size='90px' fw={700} tt="uppercase" variant="gradient"
            gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                {caseData.caseName}
        </Text>
      {navigateAway ? <Navigate to="/home" replace={true} /> : <>
      <Space h="xl" />
      <Center>
      <Button type="submit" size='md' variant="gradient" gradient={{ from: 'rgba(255, 255, 255, 0.2)', to: 'rgba(99, 234, 255, 0.8)', deg: 90 }} radius="lg" >Láda kinyitása</Button>
      </Center>
      <Space h="xl" />
             <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="xl">Megszerezhető tárgyak:</Text>
      <Space h="md" />
      <Grid>
        {caseData.items.map(item => (
          <Grid.Col span={3} key={item.itemId}>
             <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
             <Text>{item.itemName} - {item.itemSkinName}</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Card>
      </>}
    </div>
  );
}

export default CasePage;

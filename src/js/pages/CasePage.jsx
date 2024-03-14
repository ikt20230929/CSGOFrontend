import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Text, Button, Grid, Center, Space } from '@mantine/core';
import ItemContainerCase from '../components/ItemContainerCase';
import CaseOpeningAnim from '../components/CaseOpeningAnim';

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

  // Rendezzük az 'items' tömböt az árak alapján növekvő sorrendben
  useEffect(() => {
    if (caseData.items.length > 0) {
      const sortedItems = [...caseData.items].sort((a, b) => a.itemSkinValue - b.itemSkinValue);
      setCaseData(prevState => ({ ...prevState, items: sortedItems }));
    }
  }, [caseData.items]);

  return (
    <div>
        <Space h="sm"/>
        <Text size='90px' fw={700} tt="uppercase" variant="gradient"
            gradient={{ from: 'rgba(255, 255, 255, 1)', to: 'rgba(99, 234, 255, 1)', deg: 90 }}>
                {caseData.caseName}
        </Text>
      {navigateAway ? <Navigate to="/home" replace={true} /> : <>
      <Space h="xl" />
      <CaseOpeningAnim></CaseOpeningAnim>
      <Space h="xl" />
             <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="xl">Megszerezhető tárgyak:</Text>
      <Space h="md" />
      <Grid>
        {caseData.items.map(item => <ItemContainerCase key={item.inventoryId} item={item} />)}
      </Grid>
    </Card>
      </>}
    </div>
  );
}

export default CasePage;

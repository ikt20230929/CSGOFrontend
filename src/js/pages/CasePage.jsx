import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Text, Button, Grid, Space } from '@mantine/core';
import ItemContainerCase from '../components/ItemContainerCase';
import CaseOpeningAnim from '../components/CaseOpeningAnim';

function CasePage() {
  const { caseId } = useParams();
  const cases = useSelector((state) => state.data).cases;
  const [caseData, setCaseData] = useState({
    caseName: '',
    items: [],
  });
  const [navigateAway, setNavigateAway] = useState(false);

  useEffect(() => {
    const item = cases.find((item) => item.caseId == caseId);

    if (!item) {
      setNavigateAway(true);
    } else {
      const sortedItems = [...item.items];

      sortedItems.sort((a, b) => {
        const priceA = parseFloat(a.itemValue);
        const priceB = parseFloat(b.itemValue);

        if (priceA === priceB) {
          return 0;
        }
        return priceB - priceA;
      })
      setCaseData({...item, items: sortedItems});
    }
  }, [caseId, cases]);

  return (
    <div>
      <Space h="sm" />
      <Text size="90px" fw={700} tt="uppercase" variant="gradient">
        {caseData.caseName}
      </Text>
      {navigateAway ? (
        <Navigate to="/home" replace />
      ) : (
        <>
          <Space h="xl" />
          <CaseOpeningAnim caseId={caseId} />
          <Space h="xl" />
          <Card className="regpage" shadow="sm" padding="lg" radius="md" withBorder>
            <Text size="xl">Megszerezhető tárgyak:</Text>
            <Space h="md" />
            <Grid
              cols={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              gap={{ xs: 'xs', sm: 'sm', md: 'md', lg: 'lg' }}
            >
              {caseData.items.map((item) => (
                <ItemContainerCase key={item.itemId} item={item} />
              ))}
            </Grid>
          </Card>
        </>
      )}
    </div>
  );
}

export default CasePage;

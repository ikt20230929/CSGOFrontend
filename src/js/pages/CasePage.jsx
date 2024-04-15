import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Text, Grid, Space } from '@mantine/core';
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
  const [span, setSpan] = useState(3);

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
      setCaseData({ ...item, items: sortedItems });
    }
  }, [caseId, cases]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 820) {
        setSpan(6);
      } else if (width < 1200) {
        setSpan(4);
      } else {
        setSpan(3);
      }
      console.log(width);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Space h="sm" />
      <Text size="5vw" fw={700} tt="uppercase" variant="gradient">
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
            <Grid>
              {caseData.items.map((item) => (
                <ItemContainerCase key={item.itemId} item={item} span={span} />
              ))}
            </Grid>
          </Card>
        </>
      )}
    </div>
  );
}

export default CasePage;

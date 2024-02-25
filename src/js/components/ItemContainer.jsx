import { Card, Grid, Text } from '@mantine/core';
import React from 'react';

const rarityColors = ['#afafaf', '#6496e1', '#4b69cd', '#8847ff', '#d32ce6', '#eb4b4b', '#ffcc00']

export default function ItemContainer({ item }) {
    return (
        <Grid.Col span={3} data-cy="inventory-item">
            <Card className="regpage" padding="lg" radius={0} style={{borderLeftColor: rarityColors[item.itemRarity - 1], borderLeftWidth: "5px"}} withBorder>
                <Text>{item.itemName}</Text>
                <Text size="sm" c="dimmed">{item.itemSkinName}</Text>
            </Card>
        </Grid.Col>
    )
}
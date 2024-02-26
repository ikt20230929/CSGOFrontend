import { Card, Grid, Text } from '@mantine/core';
import React from 'react';

const rarityColors = ['#ffffff', '#98c0f5', '#1b7cfa', '#781bfa', '#e71bfa', '#fc3f3f', '#fcb13f', '#fcb13f']

export default function ItemContainer({ item }) {
    return (
        <Grid.Col span={3} data-cy="inventory-item">
            <Card className="regpage" padding="lg" radius={0} style={{borderLeftColor: rarityColors[item.itemRarity - 1], borderLeftWidth: "5px"}} withBorder>
                <Text>{item.itemName}</Text>
                <Text size="sm" c="dimmed">{item.itemSkinName} - {item.itemValue} $</Text>
            </Card>
        </Grid.Col>
    )
}
import { Card, Grid, Text, Checkbox } from '@mantine/core';
import React from 'react';
import { API_URL } from '../settings';

const rarityColors = ['#ffffff', '#98c0f5', '#1b7cfa', '#781bfa', '#e71bfa', '#fc3f3f', '#fcb13f', '#fcb13f']

export default function ItemContainer({ item, span }) {
    return (
        <Grid.Col span={span} data-cy="inventory-item">
            <Card className="regpage" padding="lg" radius={0} style={{ height: (span > 5 ? '200px' : '300px'), borderLeftColor: rarityColors[item.itemRarity - 1], borderLeftWidth: "5px" }} withBorder>
                <img src={`${API_URL}${item.itemAssetUrl}`} style={{ size: "3vw" }}></img>
                <Text>{item.itemName}</Text>
                <Text size="sm" c="dimmed">{item.itemSkinName} - {item.itemValue} $</Text>
            </Card>
        </Grid.Col>
    )
}
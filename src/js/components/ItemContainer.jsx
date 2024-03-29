import { Card, Grid, Text, Checkbox, Radio } from '@mantine/core';
import React from 'react';

const rarityColors = ['#ffffff', '#98c0f5', '#1b7cfa', '#781bfa', '#e71bfa', '#fc3f3f', '#fcb13f', '#fcb13f']

export default function ItemContainer({ item, onToggleItem, chance, selected }) {
    const handleClick = () => {
        if (chance) {
            onToggleItem(item.itemId);
        }
    }
    
    return (
        <Grid.Col span={3} data-cy="inventory-item">
            <Card className="regpage" padding="lg" radius={0} style={{borderColor: selected ? 'lightblue' : '', borderLeftWidth: "5px", borderLeftColor: !selected ? rarityColors[item.itemRarity - 1] : '',}} withBorder
            onClick={handleClick} >
                {!chance && <Checkbox labelPosition="right" color="cyan" radius="xl" onChange={() => onToggleItem(item.inventoryId)}/>}
                <Text>{item.itemName}</Text>
                <Text size="sm" c="dimmed">{item.itemSkinName} - {item.itemValue} $</Text>
                {chance && <Text size="sm" c="dimmed">Fejlesztési esély: {chance*100}%</Text>}
            </Card>
        </Grid.Col>
    )
}
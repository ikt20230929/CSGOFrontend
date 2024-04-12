import { Card, Grid, Text, Checkbox } from '@mantine/core';
import React from 'react';

const rarityColors = ['#ffffff', '#98c0f5', '#1b7cfa', '#781bfa', '#e71bfa', '#fc3f3f', '#fcb13f', '#fcb13f']

export default function ItemContainer({ item, onToggleItem, chance, selected, showChance }) {
    const handleClick = () => {
        if (showChance && chance != null) {
            onToggleItem(item.itemId);
        } else if (showChance) {
            onToggleItem(item);
        }
    }
    
    return (
        <Grid.Col span={3} data-cy="inventory-item">
            <Card className="regpage" padding="lg" radius={0} style={{borderColor: selected ? 'lightblue' : '', borderLeftWidth: "5px", borderLeftColor: !selected ? rarityColors[item.itemRarity - 1] : '',}} withBorder
            onClick={handleClick} >
                {showChance != true ? (
                    <Checkbox labelPosition="right" color="cyan" radius="xl" onChange={() => onToggleItem(item.inventoryId ? item.inventoryId : item.itemId)}/>
                ) : (
                    null
                )}
                <img src={item.itemAssetUrl} alt={"Hiba a betöltés közben!"} style={{size: "3vw"}}></img>
                <Text>{item.itemName}</Text>
                <Text size="sm" c="dimmed">{item.itemSkinName} - {item.itemValue} $</Text>
                {chance && <Text size="sm" c="dimmed">Fejlesztési esély: {chance*100}%</Text>}
            </Card>
        </Grid.Col>
    )
}
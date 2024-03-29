import React from 'react';
import ItemContainer from './ItemContainer';

const InventorySearchWrapper = ({ searchTerm, items, onToggleItem, showChance, chances }) => {
    let chance = undefined;
    
    return (
        <>
            {items
                .filter(
                    (item) =>
                        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.itemSkinName != null && item.itemSkinName.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((item) => {
                    if (chances != undefined) {
                        const chanceObj = chances.find(chance => chance.itemId == item.itemId);
                        chance = chanceObj ? chanceObj.chance : null;
                    }
                    return (
                        <ItemContainer key={item.inventoryId} item={item} onToggleItem={onToggleItem} chance = {showChance ? chance : null}/>
                    );
                })}
        </>
    );
};

export default InventorySearchWrapper;

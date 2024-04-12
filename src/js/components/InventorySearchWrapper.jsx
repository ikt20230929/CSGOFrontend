import React, { useState } from 'react';
import ItemContainer from './ItemContainer';

const InventorySearchWrapper = ({ searchTerm, items, onToggleItem, showChance, chances, onProfile }) => {
    let chance = undefined;
    const [selectedId, setSelectedId] = useState(null);
    
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
                        <ItemContainer key={item.inventoryId || item.itemId} item={item} 
                        onToggleItem={!showChance ? onToggleItem : (id) => {setSelectedId(id); onToggleItem(id);}} 
                        chance = {showChance ? chance : null} selected={selectedId === item.itemId}
                        showChance={showChance} onProfile={onProfile}/>
                    );
                })}
        </>
    );
};

export default InventorySearchWrapper;

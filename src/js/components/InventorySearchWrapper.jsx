import React from 'react';
import ItemContainer from './ItemContainer';

const InventorySearchWrapper = ({ searchTerm, items, onToggleItem }) => {
    return (
        <>
            {items
                .filter(
                    (item) =>
                        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.itemSkinName != null && item.itemSkinName.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((item) => (
                    <ItemContainer key={item.inventoryId} item={item} onToggleItem={onToggleItem} />
                ))}
        </>
    );
};

export default InventorySearchWrapper;

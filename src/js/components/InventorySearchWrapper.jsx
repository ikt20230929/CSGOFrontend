import React from 'react';
import ItemContainer from './ItemContainer';

const InventorySearchWrapper = ({ searchTerm, items }) => {
    return (
        <>
            {items
                .filter(
                    (item) =>
                        item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (item.itemSkinName != null && item.itemSkinName.toLowerCase().includes(searchTerm.toLowerCase()))
                )
                .map((item) => (
                    <ItemContainer key={item.inventoryId} item={item} />
                ))}
        </>
    );
};

export default InventorySearchWrapper;

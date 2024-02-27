import React from 'react';
import ItemContainer from './ItemContainer';

export default InventorySearchWrapper = ({ searchTerm, items }) => {
    return (<>
        {items.filter((item) => item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) || item.itemSkinName.toLowerCase().includes(searchTerm.toLowerCase()) ).map((item) => (
            <ItemContainer key={item.inventoryId} item={item} />
        ))}
    </>)
};
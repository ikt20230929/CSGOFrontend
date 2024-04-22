import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import InventorySearchWrapper from './InventorySearchWrapper';
import '@testing-library/jest-dom';

jest.mock('./ItemContainer', () => {
  return jest.fn(({ item, onToggleItem, chance, selected }) => (
    <div>
      <span data-testid={`item-${item.itemId}`}>{item.itemName}</span>
      <button onClick={() => onToggleItem(item.itemId)}>Toggle</button>
    </div>
  ));
});

describe('InventorySearchWrapper', () => {
  const items = [
    { itemId: 1, itemName: 'Item 1' },
    { itemId: 2, itemName: 'Item 2' },
  ];

  it('renders items based on search term', () => {
    const { getByTestId, queryByText } = render(
      <InventorySearchWrapper searchTerm="Item 1" items={items} />
    );

    expect(getByTestId('item-1')).toBeInTheDocument();
    expect(queryByText('Item 2')).not.toBeInTheDocument();
  });
});

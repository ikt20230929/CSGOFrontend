import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ItemContainer from './ItemContainer';
import { MantineProvider, Grid } from '@mantine/core';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), 
      removeListener: jest.fn(), 
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

describe('ItemContainer tesztek', () => {
  it('handleClick függvény működésének tesztelése', () => {
    const onToggleItem = jest.fn();
    const item = { itemId: 1 };
    const chance = 0.5; 
    const showChance = true; 
    const { container } = render(
<MantineProvider>
<Grid>
      <ItemContainer
        item={item}
        onToggleItem={onToggleItem}
        chance={chance}
        selected={false}
        showChance={showChance}
        onProfile={() => {}}
        spanWidth={100}
      />
            </Grid>
      </MantineProvider>
    );
    

    fireEvent.click(container.firstChild);

    const onToggleItemWithObject = jest.fn();
    render(
        <MantineProvider>
            <Grid>
      <ItemContainer
        item={item}
        onToggleItem={onToggleItemWithObject}
        chance={null}
        selected={false}
        showChance={showChance}
        onProfile={() => {}}
        spanWidth={100}
      />
      </Grid>
      </MantineProvider>
    );
    fireEvent.click(container.firstChild);
  });
});

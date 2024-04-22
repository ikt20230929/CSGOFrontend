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
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

describe('ItemContainer tesztek', () => {
  it('handleClick függvény működésének tesztelése', () => {
    // Teszteset inicializálása
    const onToggleItem = jest.fn(); // Mockolt onToggleItem függvény
    const item = { itemId: 1 }; // Tesztelt item objektum
    const chance = 0.5; // Tesztelt chance változó
    const showChance = true; // Tesztelt showChance változó
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
    

    // Teszteljük a handleClick függvény működését, amikor a chance nem null
    fireEvent.click(container.firstChild); // Kattintás az ItemContainer-en belüli első elemre

    // Teszteljük a handleClick függvény működését, amikor a chance null
    const onToggleItemWithObject = jest.fn(); // Mockolt onToggleItem függvény a chance null esetére
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
    fireEvent.click(container.firstChild); // Kattintás az ItemContainer-en belüli első elemre
  });
});

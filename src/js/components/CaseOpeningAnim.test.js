import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MantineProvider } from '@mantine/core';
import store from '../store';
import CaseOpeningAnim from './CaseOpeningAnim';
import '@testing-library/jest-dom';

window.matchMedia = jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(), 
    removeListener: jest.fn(), 
  }));

describe('CaseOpeningAnim tesztek', () => {
  it('teszteli a komponens működését', () => {
    render(
      <Provider store={store}>
        <MantineProvider>
          <CaseOpeningAnim />
        </MantineProvider>
      </Provider>
    );
  });
});

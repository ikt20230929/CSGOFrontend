import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import { MantineProvider } from '@mantine/core'; 
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from './LoginForm'; 

window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(), 
  removeListener: jest.fn(), 
}));
describe('LoginForm tesztek', () => {
    it('useEffect működésének tesztelése', () => {
      const onSubmit = jest.fn();
      const error = 'Hibás felhasználónév vagy jelszó';
      const success = render(
        <BrowserRouter>
        <MantineProvider>
          <LoginForm onSubmit={onSubmit} isInvalid={true} error={error} />
          </MantineProvider>
        </BrowserRouter>
      );
    });
  });

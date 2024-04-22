import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // For additional matchers like toBeInTheDocument
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { LoginForm } from './LoginForm'; // Import your LoginForm component

// Mock window.matchMedia
window.matchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  addListener: jest.fn(), // Deprecated
  removeListener: jest.fn(), // Deprecated
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

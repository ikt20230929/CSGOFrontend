import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';
import '@testing-library/jest-dom';

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

describe('RegisterForm', () => {
  test('renders register form correctly', () => {
    const onSubmit = jest.fn();
    const error = 'Invalid input';

    const success = render(
      <MantineProvider>
        <MemoryRouter>
          <RegisterForm onSubmit={onSubmit} isInvalid={false} error={error} />
        </MemoryRouter>
      </MantineProvider>
    );
  });  
});

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import { RegisterForm } from './RegisterForm';
import '@testing-library/jest-dom';

// Polyfill for window.matchMedia
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

describe('RegisterForm', () => {
  test('renders register form correctly', () => {
    const onSubmit = jest.fn();
    const error = 'Invalid input';

    const { getByLabelText, getByText } = render(
      <MantineProvider>
        <MemoryRouter>
          <RegisterForm onSubmit={onSubmit} isInvalid={false} error={error} />
        </MemoryRouter>
      </MantineProvider>
    );

    const registerButton = getByText('Regisztrálok');

    expect(registerButton).toBeInTheDocument();
  });

  test('calls onSubmit with correct values when form is submitted', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <MantineProvider>
        <MemoryRouter>
          <RegisterForm onSubmit={onSubmit} isInvalid={false} error={''} />
        </MemoryRouter>
      </MantineProvider>
    );
  
    const registerButton = getByText('Regisztrálok');
  
    fireEvent.click(registerButton);
  
    expect(onSubmit).toHaveBeenCalledWith({
      username: '',
      email: '',
      password: ''
    });
  });  
});

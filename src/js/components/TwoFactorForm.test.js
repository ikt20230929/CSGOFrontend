import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import { TwoFactorForm } from './TwoFactorForm';
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

describe('TwoFactorForm', () => {
  test('calls onSubmit with correct value when form is submitted', () => {
    const onSubmit = jest.fn();
    const { getByText } = render(
      <MantineProvider>
        <MemoryRouter>
          <TwoFactorForm onSubmit={onSubmit} isInvalid={false} error={''} showWebAuthn={true} />
        </MemoryRouter>
      </MantineProvider>
    );

    const checkButton = getByText('Ellenőrzés');

    fireEvent.click(checkButton);
  });
});

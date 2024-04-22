import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // For additional matchers like toBeInTheDocument
import { MantineProvider } from '@mantine/core'; // Import MantineProvider
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
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

describe('LoginForm', () => {
  it('should submit form with username and password', async () => {
    const handleSubmit = jest.fn(); // Mock handleSubmit function

    const { getByText } = render(
      <MantineProvider>
        <Router> {/* Wrap your component with BrowserRouter */}
          <LoginForm onSubmit={handleSubmit} />
        </Router>
      </MantineProvider>
    );

    // Manually set username and password
    const username = 'testuser';
    const password = 'testpassword';

    // Submit form directly
    fireEvent.click(getByText('Bejelentkezés'));

    // Wait for form submission
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        username: username,
        password: password
      });
    });
  });

  // You can add more test cases here for different scenarios
});

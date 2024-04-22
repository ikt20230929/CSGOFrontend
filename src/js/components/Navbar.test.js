import React from 'react';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom'; 
import Navbar from './Navbar';
import { MantineProvider } from '@mantine/core';
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

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

describe('Navbar tesztek', () => {
  it('items generálása', () => {
    useSelector.mockImplementation((selector) => selector({
      auth: { accessToken: 'dummyToken' },
      data: { profile: { userIsAdmin: true } }
    }));

    const links = [
        { link: '/home', label: 'Kezdőlap', Image: '/assets/home.png', needsLogin: false },
        { link: '/loginstreak', label: "Napi jutalom", Image: '/assets/calendar.png', needsLogin: true },
        { link: '/giveaway', label: 'Nyereményjátékok', Image: '/assets/give.png', needsLogin: true },
        { link: '/upgrader', label: 'Upgrader', Image: '/assets/upgrade.png', needsLogin: true },
        { link: '/login', label: 'Bejelentkezés', needsLogin: false, hideWhenLoggedIn: true }
    ];

    const { getByText } = render(
      <MemoryRouter>
        <MantineProvider>
        <Navbar links={links} />
        </MantineProvider>
      </MemoryRouter>
    );

    links.forEach((link) => {
      const shouldRender = !link.needsLogin || (true && link.needsLogin);
      if (shouldRender && !(true && link.hideWhenLoggedIn)) {
        const label = link.label;
        expect(getByText(label)).toBeTruthy(); 
      }
    });
  });
});

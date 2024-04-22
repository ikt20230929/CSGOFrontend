import React from 'react';
import { render } from '@testing-library/react';
import { useSelector } from 'react-redux'; // Ha a useSelector-t használod a komponensben
import { MemoryRouter } from 'react-router-dom'; // Importáljuk a MemoryRouter-t a Link komponensek teszteléséhez
import Navbar from './Navbar'; // A tesztelendő Navbar komponens
import { MantineProvider } from '@mantine/core';
import '@testing-library/jest-dom';

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

// Mockoljuk a useSelector hookot
jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

describe('Navbar tesztek', () => {
  it('items generálása', () => {
    // Definiáljuk a mockált useSelector függvényt
    useSelector.mockImplementation((selector) => selector({
      auth: { accessToken: 'dummyToken' }, // Vagy amit tesztelni szeretnél
      data: { profile: { userIsAdmin: true } } // Vagy amit tesztelni szeretnél
    }));

    // Definiáljuk a teszt links tömböt
    const links = [
        { link: '/home', label: 'Kezdőlap', Image: '/assets/home.png', needsLogin: false },
        { link: '/loginstreak', label: "Napi jutalom", Image: '/assets/calendar.png', needsLogin: true },
        { link: '/giveaway', label: 'Nyereményjátékok', Image: '/assets/give.png', needsLogin: true },
        { link: '/upgrader', label: 'Upgrader', Image: '/assets/upgrade.png', needsLogin: true },
        { link: '/login', label: 'Bejelentkezés', needsLogin: false, hideWhenLoggedIn: true }
    ];

    // Renderezzük a komponenst a megfelelő contexttel (MemoryRouter a Link komponensek miatt)
    const { getByText } = render(
      <MemoryRouter>
        <MantineProvider>
        <Navbar links={links} />
        </MantineProvider>
      </MemoryRouter>
    );

    // Ellenőrizzük, hogy minden megfelelő elemet létrehozott-e az items
    links.forEach((link) => {
      const shouldRender = !link.needsLogin || (true && link.needsLogin);
      if (shouldRender && !(true && link.hideWhenLoggedIn)) {
        const label = link.label;
        expect(getByText(label)).toBeTruthy(); // Vagy használhatsz más getBy metódust a megfelelő kereséshez
      }
    });
  });
});

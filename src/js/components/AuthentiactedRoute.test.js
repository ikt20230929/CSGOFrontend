import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { AuthenticatedRoute } from "./AuthenticatedRoute";
import configureStore from "redux-mock-store";
import '@testing-library/jest-dom'


// Redux által használt alapértelmezett állapot létrehozása
const initialState = {
  auth: {
    accessToken: "exampleAccessToken"
  },
  data: {
    profile: {
      userIsAdmin: true // vagy false, attól függően, hogy az admin ellenőrzést teszteljük-e
    }
  }
};

// Redux mock store létrehozása
const mockStore = configureStore([]);

describe("AuthenticatedRoute komponens tesztelése", () => {
  test("Sikeres belépés esetén a gyermekek megjelennek", () => {
    const store = mockStore(initialState);
    const { queryByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/home"]}>
          <AuthenticatedRoute checkAdmin={false}>
            <div data-testid="children">Gyermekek komponense</div>
          </AuthenticatedRoute>
        </MemoryRouter>
      </Provider>
    );

    expect(queryByText("Gyermekek komponense")).toBeInTheDocument();
  });

  test("Sikertelen belépés esetén a felhasználó átirányítódik a bejelentkező oldalra", () => {
    const store = mockStore({ ...initialState, auth: { accessToken: null } });
    const { queryByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/home"]}>
          <AuthenticatedRoute checkAdmin={false}>
            <div data-testid="children">Gyermekek komponense</div>
          </AuthenticatedRoute>
        </MemoryRouter>
      </Provider>
    );

    // Ellenőrizzük, hogy az átirányítás megtörtént-e a bejelentkező oldalra
    expect(queryByText("Gyermekek komponense")).not.toBeInTheDocument();
    expect(queryByText("Bejelentkező oldal")).toBeInTheDocument(); // Ez a szöveg csak illusztráció, helyettesítsd valóságos szöveggel
  });

  test("Sikeres belépés esetén az adminok a /home oldalra irányítódnak", () => {
    const store = mockStore(initialState);
    const { queryByText } = render(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/home"]}>
          <AuthenticatedRoute checkAdmin={true}>
            <div data-testid="children">Gyermekek komponense</div>
          </AuthenticatedRoute>
        </MemoryRouter>
      </Provider>
    );

    // Ellenőrizzük, hogy az átirányítás megtörtént-e a /home oldalra
    expect(queryByText("Gyermekek komponense")).not.toBeInTheDocument();
    expect(queryByText("Bejelentkező oldal")).not.toBeInTheDocument();
    expect(queryByText("Főoldal")).toBeInTheDocument(); // Ez a szöveg csak illusztráció, helyettesítsd valóságos szöveggel
  });
});

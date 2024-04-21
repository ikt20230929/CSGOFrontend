import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter } from "react-router-dom";
import { AuthenticatedRoute } from "./AuthenticatedRoute";
import '@testing-library/jest-dom';

// Mock Redux store
const initialState = {
  auth: {
    accessToken: "mockAccessToken" // Assuming the user is authenticated
  },
  data: {
    profile: {
      userIsAdmin: true // Assuming the user is an admin
    }
  }
};

function reducer(state = initialState) {
  return state;
}

const store = createStore(reducer);

describe("AuthenticatedRoute Component", () => {
  it("renders children when user is authenticated and is an admin", () => {
    const { getByText } = render(
      <Provider store={store}>
        <BrowserRouter>
          <AuthenticatedRoute checkAdmin={true}>
            <div>Admin Content</div>
          </AuthenticatedRoute>
        </BrowserRouter>
      </Provider>
    );
    expect(getByText("Admin Content")).toBeInTheDocument();
  });
});

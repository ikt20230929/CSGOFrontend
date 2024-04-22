import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { BrowserRouter } from "react-router-dom";
import { AuthenticatedRoute } from "./AuthenticatedRoute";
import '@testing-library/jest-dom';

const initialState = {
  auth: {
    accessToken: "mockAccessToken" 
  },
  data: {
    profile: {
      userIsAdmin: true 
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

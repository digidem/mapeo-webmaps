import React from "react";
import { render, act } from "./test-utils";
import firebase from "firebase/app";
import * as reachRouter from "@reach/router";
import userEvent from "@testing-library/user-event";

import Login from "./Login";
import * as authHooks from "react-firebase-hooks/auth";

const setPersistence = jest.fn(() => Promise.resolve());
const signInWithEmailAndPassword = jest.fn(() => Promise.resolve());
reachRouter.navigate = jest.fn();

firebase.auth = () => ({
  setPersistence,
  signInWithEmailAndPassword,
});
firebase.auth.Auth = {
  Persistence: {
    LOCAL: "LOCAL",
    NONE: "NONE",
  },
};
jest.mock("react-firebase-hooks/auth");

beforeEach(jest.clearAllMocks);

describe("Initial load", () => {
  it("Redirects when user is logged in", () => {
    authHooks.useAuthState.mockReturnValue([true]);
    render(<Login location={{}} />);
    expect(reachRouter.navigate).toHaveBeenCalledTimes(1);
    expect(reachRouter.navigate).toHaveBeenCalledWith("/", { replace: true });
  });

  it("Redirects to `from` state path when logged in", () => {
    authHooks.useAuthState.mockReturnValue([true]);
    render(<Login location={{ state: { from: "/foo" } }} />);
    expect(reachRouter.navigate).toHaveBeenCalledTimes(1);
    expect(reachRouter.navigate).toHaveBeenCalledWith("/foo", {
      replace: true,
    });
  });

  it("Doesn't redirect if user is not logged in", () => {
    authHooks.useAuthState.mockReturnValue([null, true]);
    render(<Login location={{ state: { from: "/foo" } }} />);
    expect(reachRouter.navigate).toHaveBeenCalledTimes(0);
  });

  it("Disables login button during initialization", () => {
    authHooks.useAuthState.mockReturnValue([null, true]);
    const { getByTestId } = render(<Login location={{}} />);
    expect(getByTestId("submit-button")).toBeDisabled();
  });

  it("Enables login button after initialization", () => {
    authHooks.useAuthState.mockReturnValue([null, false]);
    const { getByTestId } = render(<Login location={{}} />);
    expect(getByTestId("submit-button")).toBeEnabled();
  });
});

describe("Form filling", () => {
  it("Calls firebase login with email and password", () => {
    authHooks.useAuthState.mockReturnValue([null, false]);
    const { getByLabelText, getByTestId } = render(<Login location={{}} />);
    userEvent.type(getByLabelText(/Email Address/), "bob@example.com");
    userEvent.type(getByLabelText(/Password/), "password");
    userEvent.click(getByTestId("submit-button"));
    return new Promise((resolve) => {
      process.nextTick(() => {
        expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
          "bob@example.com",
          "password"
        );
        resolve();
      });
    });
  });

  it("By default auth persistence is set to NONE", () => {
    authHooks.useAuthState.mockReturnValue([null, false]);
    const { getByTestId } = render(<Login location={{}} />);
    userEvent.click(getByTestId("submit-button"));
    return new Promise((resolve) => {
      process.nextTick(() => {
        expect(setPersistence).toHaveBeenCalledWith("NONE");
        resolve();
      });
    });
  });

  it("Clicking 'Remember me' sets auth persistence to LOCAL", () => {
    authHooks.useAuthState.mockReturnValue([null, false]);
    const { getByLabelText, getByTestId } = render(<Login location={{}} />);
    userEvent.click(getByLabelText(/Remember Me/));
    userEvent.click(getByTestId("submit-button"));
    return new Promise((resolve) => {
      process.nextTick(() => {
        expect(setPersistence).toHaveBeenCalledWith("LOCAL");
        resolve();
      });
    });
  });

  it("During submit, button is disabled", () => {
    authHooks.useAuthState.mockReturnValue([null, false]);
    const { getByTestId } = render(<Login location={{}} />);
    const button = getByTestId("submit-button");
    userEvent.click(button);
    expect(button).toBeDisabled();
  });

  it("After error, button is enabled", async () => {
    authHooks.useAuthState.mockReturnValue([null, false]);
    let reject;
    setPersistence.mockImplementation(
      () =>
        new Promise((_, _reject) => {
          reject = _reject;
        })
    );
    const { getByTestId } = render(<Login location={{}} />);
    const button = getByTestId("submit-button");
    userEvent.click(button);
    await act(async () => reject(new Error()));
    expect(button).toBeEnabled();
  });
});

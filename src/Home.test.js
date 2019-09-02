import React from "react";
import { render } from "@testing-library/react";
import Home from "./Home";

it("renders welcome message", () => {
  const { getByText } = render(<Home />);
  expect(getByText("Learn React")).toBeInTheDocument();
});

/* eslint-disable @typescript-eslint/no-require-imports */
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ReactQueryProvider } from "./ReactQueryProvider";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

jest.mock("@tanstack/react-query", () => {
  const original = jest.requireActual("@tanstack/react-query");
  return {
    ...original,
    QueryClient: jest.fn(),
    QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="query-client-provider">{children}</div>
    ),
  };
});

jest.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: jest
    .fn()
    .mockImplementation((props) => (
      <div data-testid="react-query-devtools">{JSON.stringify(props)}</div>
    )),
}));

jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useState: jest
      .fn()
      .mockImplementation((initialState) => [
        typeof initialState === "function" ? initialState() : initialState,
        jest.fn(),
      ]),
  };
});

describe("ReactQueryProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (QueryClient as jest.Mock).mockImplementation(() => ({}));
  });

  it("should render children correctly", () => {
    const { getByText } = render(
      <ReactQueryProvider>
        <div>Test Child</div>
      </ReactQueryProvider>
    );

    expect(getByText("Test Child")).toBeInTheDocument();
  });

  it("should create QueryClient with correct options", () => {
    render(<ReactQueryProvider>Test</ReactQueryProvider>);

    expect(QueryClient).toHaveBeenCalledWith({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
          retry: 1,
        },
      },
    });
  });

  it("should render ReactQueryDevtools", () => {
    const { getByTestId } = render(
      <ReactQueryProvider>Content</ReactQueryProvider>
    );

    expect(ReactQueryDevtools).toHaveBeenCalled();

    const devtools = getByTestId("react-query-devtools");
    expect(devtools).toBeInTheDocument();
    expect(devtools.textContent).toContain('"initialIsOpen":false');
  });

  it("should use useState to create a stable QueryClient instance", () => {
    const { useState } = require("react");

    render(<ReactQueryProvider>Test</ReactQueryProvider>);

    expect(useState).toHaveBeenCalled();

    const stateInitializer = (useState as jest.Mock).mock.calls[0][0];
    expect(typeof stateInitializer).toBe("function");
  });

  it("should wrap children with QueryClientProvider", () => {
    const { getByTestId } = render(
      <ReactQueryProvider>
        <div>Child component</div>
      </ReactQueryProvider>
    );

    expect(getByTestId("query-client-provider")).toBeInTheDocument();
  });
});

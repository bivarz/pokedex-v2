/* eslint-disable @typescript-eslint/no-require-imports */
import axios from "axios";
import { api } from "./axios";

jest.mock("axios", () => {
  return {
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    })),
  };
});

describe("Axios API client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create axios instance with correct baseURL", () => {
    jest.isolateModules(() => {
      require("./axios");
    });

    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "https://pokeapi.co/api/v2",
    });
  });

  it("should export an axios instance", () => {
    expect(api).toBeDefined();
    expect(api).toHaveProperty("get");
    expect(api).toHaveProperty("post");
    expect(api).toHaveProperty("interceptors");
  });
});

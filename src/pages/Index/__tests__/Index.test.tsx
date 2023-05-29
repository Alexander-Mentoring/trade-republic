import {
  act,
  fireEvent,
  getByPlaceholderText,
  render,
} from "@testing-library/react";
import { IndexPage } from "../Index";

jest.mock("react-use-websocket", () =>
  jest.fn(() => ({
    sendJsonMessage: jest.fn(),
    lastJsonMessage: null,
  }))
);

const useWebSocketMock = jest.requireMock("react-use-websocket") as jest.Mock;

describe("Index Page", () => {
  afterAll(() => {
    useWebSocketMock.mockReset();
  });
  it("renders", async () => {
    const result = render(<IndexPage />);

    expect(result.container).toContainElement(
      getByPlaceholderText(result.container, "Enter ISIN")
    );
  });

  it("adds valid ISIN", async () => {
    const result = render(<IndexPage />);

    const input = result.getByPlaceholderText("Enter ISIN");

    act(() => {
      fireEvent.change(input, { target: { value: "US88579Y1010" } });

      fireEvent.click(result.getByText("Add"));
    });

    const trs = Array.from(result.container.querySelectorAll("tr"));
    const desireRow = trs.find((tr) =>
      tr.textContent?.includes("US88579Y1010")
    );
    expect(desireRow).toBeInTheDocument();
  });

  describe("ISIN validation", () => {
    it("shows error when lenght of ISIN less then 12", async () => {
      const result = render(<IndexPage />);

      const input = result.getByPlaceholderText("Enter ISIN");

      act(() => {
        fireEvent.change(input, { target: { value: "US88579" } });

        fireEvent.click(result.getByText("Add"));
      });

      expect(
        await result.findByText("ISIN must be 12 characters long")
      ).toBeInTheDocument();
    });

    it("shows error when try to add already subscribed ISIN", async () => {
      const result = render(<IndexPage />);

      const input = result.getByPlaceholderText("Enter ISIN");

      act(() => {
        fireEvent.change(input, { target: { value: "US88579Y1010" } });

        fireEvent.click(result.getByText("Add"));
      });

      act(() => {
        fireEvent.change(input, { target: { value: "US88579Y1010" } });

        fireEvent.click(result.getByText("Add"));
      });

      result.debug();
      expect(
        await result.findByText("You already subscribed on this ISIN")
      ).toBeInTheDocument();
    });

    it("shows error when check digit in ISIN invalid", async () => {
      const result = render(<IndexPage />);

      const input = result.getByPlaceholderText("Enter ISIN");

      act(() => {
        fireEvent.change(input, { target: { value: "US88579Y1011" } });

        fireEvent.click(result.getByText("Add"));
      });

      expect(
        await result.findByText("Check digit is wrong")
      ).toBeInTheDocument();
    });
  });

  describe("websocket disconnection", () => {
    // Should use this flag to prevent infinity loop with state
    it("shows error message when can not recconect", async () => {
      let called = false;

      useWebSocketMock.mockImplementation((_, options) => {
        if (!called) {
          options.onReconnectStop();
          called = true;
        }

        return {
          sendJsonMessage: jest.fn(),
          lastJsonMessage: null,
        };
      });

      const result = render(<IndexPage />);

      expect(
        await result.findByText("Can not reconnect, try to reload page")
      ).toBeInTheDocument();
    });

    it("shows warning message when connections closed", async () => {
      let called = false;

      useWebSocketMock.mockImplementation((_, options) => {
        if (!called) {
          options.shouldReconnect();
          called = true;
        }

        return {
          sendJsonMessage: jest.fn(),
          lastJsonMessage: null,
        };
      });

      const result = render(<IndexPage />);

      expect(
        await result.findByText(
          "Lost connection with server. Data might be outdated, we try to reconnect"
        )
      ).toBeInTheDocument();
    });

    it("resubscribes to isins after reconnection", async () => {
      let called = false;
      const sendJson = jest.fn();
      useWebSocketMock.mockImplementation((_, options) => {
        if (!called) {
          options.onOpen();
          called = true;
        }

        return {
          sendJsonMessage: sendJson,
          lastJsonMessage: null,
        };
      });

      const result = render(<IndexPage />);

      const input = result.getByPlaceholderText("Enter ISIN");

      act(() => {
        fireEvent.change(input, { target: { value: "US88579Y1010" } });

        fireEvent.click(result.getByText("Add"));
      });

      expect(sendJson).toHaveBeenCalledWith({
        subscribe: "US88579Y1010",
      });
    });
  });
});

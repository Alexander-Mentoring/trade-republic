import { render } from "@testing-library/react";
import { ISINRow } from "..";
describe("ISINRow", () => {
  it("calls subscribe onMoun", () => {
    const subscribe = jest.fn();
    render(
      <ISINRow
        isin="US00724F1012"
        subscribe={subscribe}
        unsubscribe={jest.fn}
        onUnsubscribe={jest.fn()}
        lastState={{
          isin: "US00724F1012",
          price: 0,
        }}
      />
    );
    expect(subscribe).toBeCalledWith("US00724F1012");
  });

  it("calls unsubscribe onOnmount", () => {
    const unsubscribe = jest.fn();
    const result = render(
      <ISINRow
        isin="US00724F1012"
        subscribe={jest.fn()}
        unsubscribe={unsubscribe}
        onUnsubscribe={jest.fn()}
        lastState={{
          isin: "US00724F1012",
          price: 0,
        }}
      />
    );

    result.unmount();
    expect(unsubscribe).toBeCalledWith("US00724F1012");
  });

  it("renders price and isin", async () => {
    const result = render(
      <ISINRow
        isin="US00724F1012"
        subscribe={jest.fn()}
        unsubscribe={jest.fn}
        onUnsubscribe={jest.fn()}
        lastState={{
          isin: "US00724F1012",
          price: 333.432135,
        }}
      />
    );

    expect(await result.findByText("US00724F1012")).toBeInTheDocument();
    expect(await result.findByText("333.432135")).toBeInTheDocument();
  });

  it("updates price when lastState.isin === isin", async () => {
    const result = render(
      <ISINRow
        isin="US00724F1012"
        subscribe={jest.fn()}
        unsubscribe={jest.fn}
        onUnsubscribe={jest.fn()}
        lastState={{
          isin: "US00724F1012",
          price: 333.432135,
        }}
      />
    );

    expect(await result.findByText("333.432135")).toBeInTheDocument();

    result.rerender(
      <ISINRow
        isin="US00724F1012"
        subscribe={jest.fn()}
        unsubscribe={jest.fn}
        onUnsubscribe={jest.fn()}
        lastState={{
          isin: "US00724F1012",
          price: 444.432135,
        }}
      />
    );

    expect(await result.findByText("US00724F1012")).toBeInTheDocument();
    expect(await result.findByText("444.432135")).toBeInTheDocument();
  });

  it("not updates price when lastState.isin !== isin", async () => {
    const result = render(
      <ISINRow
        isin="US00724F1012"
        subscribe={jest.fn()}
        unsubscribe={jest.fn}
        onUnsubscribe={jest.fn()}
        lastState={{
          isin: "US00724F1012",
          price: 333.432135,
        }}
      />
    );

    expect(await result.findByText("333.432135")).toBeInTheDocument();

    result.rerender(
      <ISINRow
        isin="US00724F1012"
        subscribe={jest.fn()}
        unsubscribe={jest.fn}
        onUnsubscribe={jest.fn()}
        lastState={{
          isin: "US00724F1012_new",
          price: 444.432135,
        }}
      />
    );

    expect(await result.findByText("US00724F1012")).toBeInTheDocument();
    expect(await result.findByText("333.432135")).toBeInTheDocument();
  });
});

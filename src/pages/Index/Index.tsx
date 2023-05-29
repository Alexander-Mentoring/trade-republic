import { useCallback, useMemo, useState } from "react";
import { SearchInput } from "../../components/SearchInput/SearchInput";
import { Table } from "../../components/Table/Table";
import { ISINRow } from "./components/ISINRow";
import { Button } from "../../components/Button/Button/Button";
import useWebSocket from "react-use-websocket";
import "./Index.css";

export function IndexPage() {
  const [inputValue, setInputValue] = useState("");
  const { sendJsonMessage, lastJsonMessage } = useWebSocket<{
    price: number;
    isin: string;
  } | null>("ws://localhost:8425/");

  const [subscribedISINS, setSubscribedISINS] = useState(new Set<string>());

  const subscribe = useCallback(
    (isin: string) => {
      sendJsonMessage({
        subscribe: isin,
      });
    },
    [sendJsonMessage]
  );

  const unsubscribe = useCallback(
    (isin: string) => {
      sendJsonMessage({
        unsubscribe: isin,
      });
    },
    [sendJsonMessage]
  );

  const rows = useMemo(() => {
    return Array.from(subscribedISINS).map((isin) => {
      return (
        <ISINRow
          lastState={lastJsonMessage}
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          key={isin}
          isin={isin}
          onUnsubscribe={(isin) => {
            setSubscribedISINS((prev) => {
              const newValue = new Set(prev);
              newValue.delete(isin);
              return newValue;
            });
          }}
        />
      );
    });
  }, [lastJsonMessage, subscribe, subscribedISINS, unsubscribe]);

  return (
    <div className="index__layout">
      <form
        className="index__form"
        onSubmit={(e) => {
          e.preventDefault();
          setSubscribedISINS((prev) => new Set(prev).add(inputValue));
          setInputValue("");
        }}
      >
        <div className="index__input">
          <SearchInput
            name="isin"
            type="text"
            placeholder="Enter ISIN"
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
        </div>
        <div className="index__button">
          <Button type="submit">Add</Button>
        </div>
      </form>
      <div className="index__table">
        <h2 className="index__table-label">Subscribed ISINS</h2>
        <Table headings={["Name", "Price"]} rows={rows} />
      </div>
    </div>
  );
}

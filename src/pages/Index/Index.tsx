import { useCallback, useMemo, useState } from "react";
import { SearchInput } from "../../components/SearchInput/SearchInput";
import { Table } from "../../components/Table/Table";
import { ISINRow } from "./components/ISINRow";
import { Button } from "../../components/Button/Button/Button";
import useWebSocket from "react-use-websocket";
import isValidISIN from "isin-validator";
import "./Index.css";
import {
  ErrorBannerError,
  ErrorBanner,
} from "../../components/ErrorBanner/ErrorBanner";

export function IndexPage() {
  const [inputValue, setInputValue] = useState("");
  const [userErros, setUserErrors] = useState<string[]>([]);
  const [subscribedISINS, setSubscribedISINS] = useState(new Set<string>());
  const [networkError, setNetworkError] = useState<ErrorBannerError>();
  const { sendJsonMessage, lastJsonMessage } = useWebSocket<{
    price: number;
    isin: string;
  } | null>("ws://localhost:8425/", {
    retryOnError: true,
    onReconnectStop: () => {
      setNetworkError({
        message: "Can not reconnect, try to reload page",
        title: "Network error",
        type: "warning",
      });
    },
    reconnectAttempts: 5,
    shouldReconnect: () => {
      setNetworkError({
        message:
          "Lost connection with server. Data might be outdated, we try to reconnect",
        title: "Network error",
        type: "warning",
      });

      return true;
    },
    reconnectInterval: (number) => {
      return Math.E * number * 100;
    },
    onOpen: () => {
      setNetworkError(undefined);
      if (subscribedISINS.size !== 0) {
        subscribedISINS.forEach((isin) => {
          sendJsonMessage({
            subscribe: isin,
          });
        });
      }
    },
  });

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

  const handleSubmitISIN = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (subscribedISINS.has(inputValue)) {
      setUserErrors(["You already subscribed on this ISIN"]);
      return;
    }
    isValidISIN(inputValue, (err) => {
      if (err) {
        setUserErrors([err.message]);
        return;
      }

      setSubscribedISINS((prev) => new Set(prev).add(inputValue));
      setInputValue("");
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setUserErrors([]);
  };

  return (
    <>
      {networkError && (
        <ErrorBanner
          message={networkError.message}
          title={networkError.title}
          type={networkError.type}
        />
      )}

      <div className="index__layout">
        {userErros.map((error) => (
          <div>{error}</div>
        ))}
        <form className="index__form" onSubmit={handleSubmitISIN}>
          <div className="index__input">
            <SearchInput
              name="isin"
              type="text"
              placeholder="Enter ISIN"
              onChange={handleChange}
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
    </>
  );
}

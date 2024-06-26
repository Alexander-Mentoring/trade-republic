import { useCallback, useMemo, useState } from "react";
import { SearchInput } from "../../components/SearchInput/SearchInput";
import { Table } from "../../components/Table/Table";
import { ISINRow } from "./components/ISINRow";
import { Button } from "../../components/Button/Button";
import useWebSocket from "react-use-websocket";
import isValidISIN from "isin-validator";
import "./Index.css";
import {
  ErrorBannerError,
  ErrorBanner,
} from "../../components/ErrorBanner/ErrorBanner";
import { ErrorsList } from "../../components/ErrorsList/ErrorsList";
import translations from "./transaltions/en.json";

const validISINsList = [
  "US88579Y1010	",
  "US8318652091",
  "US0028241000",
  "US0036541003",
  "IE00B4BNMY34",
  "US00724F1012",
  "US03073E1055",
  "US03073E1055",
  "US03073E1055",
];

export function IndexPage() {
  const [inputValue, setInputValue] = useState("");
  const [userErrors, setUserErrors] = useState<string[]>([]);
  const [subscribedISINS, setSubscribedISINS] = useState(new Set<string>());
  const [networkError, setNetworkError] = useState<ErrorBannerError>();
  const { sendJsonMessage, lastJsonMessage } = useWebSocket<{
    price: number;
    isin: string;
  } | null>("ws://localhost:8425/", {
    retryOnError: true,
    onReconnectStop: () => {
      setNetworkError({
        message: translations.networkErrors.canNotReconnect.message,
        type: "error",
      });
    },
    reconnectAttempts: 5,
    shouldReconnect: () => {
      setNetworkError({
        message: translations.networkErrors.lostConnection.message,
        type: "warning",
      });

      return true;
    },
    reconnectInterval: (number) => {
      /*
        In order to avoid spamming the backend, 
        we gradually increase the interval between each subsequent request using an exponential function.
      */
      return Math.exp(number) * 100;
    },
    onOpen: () => {
      setNetworkError(undefined);
      if (subscribedISINS.size !== 0) {
        // When reconnecting, it is important to note that the backend does not save subscribed ISINs.
        // Therefore, we must resubscribe to our ISINs.
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
      setUserErrors([translations.validationErrors.alreadySubscribedISIN]);
      return;
    }
    isValidISIN(inputValue, (err) => {
      if (err) {
        setUserErrors([err.message]);
        return;
      }

      setUserErrors([]);
      setSubscribedISINS((prev) => new Set(prev).add(inputValue));
      setInputValue("");
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setUserErrors([]);
  };

  const handleAddValidISIN = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const index = Math.round(Math.random() * (validISINsList.length - 1));
    setInputValue(validISINsList[index]);
  };

  return (
    <>
      {networkError && (
        <ErrorBanner message={networkError.message} type={networkError.type} />
      )}

      <div className="index__layout">
        <form className="index__form" onSubmit={handleSubmitISIN}>
          <div className="index__input">
            <SearchInput
              name="isin"
              type="text"
              placeholder={translations.searchInput.placeholder}
              onChange={handleChange}
              value={inputValue}
            />
          </div>
          <div className="index__button">
            <Button type="submit">Add</Button>
          </div>
          <div className="index__button">
            <Button onClick={handleAddValidISIN}>Add Valid ISIN</Button>
          </div>
        </form>
        {userErrors.length !== 0 && <ErrorsList errors={userErrors} />}
        <div className="index__table">
          <h2 className="index__table-label">Subscribed ISINS</h2>
          <Table
            headings={[
              translations.table.headings.name,
              translations.table.headings.price,
            ]}
            rows={rows}
          />
        </div>
      </div>
    </>
  );
}

import { memo, useEffect, useState } from "react";
import { Td, Tr } from "../../../../components/Table/Table";
import { Button } from "../../../../components/Button/Button/Button";

type Props = {
  isin: string;
  subscribe: (isin: string) => void;
  unsubscribe: (isin: string) => void;
  lastState: { price: number; isin: string } | null;
  onUnsubscribe?: (isin: string) => void;
};

export function ISINRow({
  subscribe,
  isin,
  unsubscribe,
  lastState,
  onUnsubscribe,
}: Props) {
  const [price, setPrice] = useState<number | null>(null);
  useEffect(() => {
    subscribe(isin);

    return () => {
      unsubscribe(isin);
    };
  }, [isin, subscribe, unsubscribe]);

  useEffect(() => {
    if (lastState?.isin === isin) {
      setPrice(lastState.price);
    }
  }, [isin, lastState?.isin, lastState?.price]);

  return (
    <Tr>
      <Td>{isin}</Td>
      <Td>{price?.toFixed(6)}</Td>
      {onUnsubscribe && (
        <Td>
          <Button onClick={() => onUnsubscribe(isin)}>Unsubscribe</Button>
        </Td>
      )}
    </Tr>
  );
}

// I optimize this component by memoizing it to preserve re-rendering on every message from sockets.
// We refresh it only if the message contains the same "isin" as our raw.
export const MemoISINRow = memo(ISINRow, (prevProps, newProps) => {
  if (Object.is(prevProps, newProps)) {
    return true;
  }

  const excludedPropsNames: (keyof Props)[] = [
    "subscribe",
    "unsubscribe",
    "lastState",
    "onUnsubscribe",
  ];

  const propKeys = Object.keys(prevProps) as (keyof Props)[];

  const isEqualProps = propKeys.every((propName) => {
    if (excludedPropsNames.includes(propName)) {
      return true;
    }

    return Object.is(prevProps[propName], newProps[propName]);
  });

  if (isEqualProps && newProps.isin !== newProps.lastState?.isin) {
    return true;
  }

  return false;
});

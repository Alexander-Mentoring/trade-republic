import "./Table.css";

type Props = {
  headings: string[];
  rows: React.ReactNode[];
};

export function Table(props: Props) {
  return (
    <table className="table">
      <thead>
        <tr>
          {props.headings.map((head) => (
            <th key={head} className="th">
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{props.rows}</tbody>
    </table>
  );
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="tr">{children}</tr>;
}

export function Td({ children }: { children: React.ReactNode }) {
  return <td className="td">{children}</td>;
}

import "./Table.css";

type Props = {
  headings: string[];
  rows: React.ReactNode[][];
};

export function Table(props: Props) {
  return (
    <table className="table">
      <thead>
        <tr>
          {props.headings.map((head) => (
            <th className="th">{head}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows.map((tr) => {
          return (
            <tr className="tr">
              {tr.map((td) => (
                <td className="td">{td}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

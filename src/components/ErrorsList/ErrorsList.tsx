import "./ErrorsList.css";

type Props = {
  errors: string[];
};
export function ErrorsList({ errors }: Props) {
  return (
    <ul className="errorsList">
      {errors.map((error) => (
        <li>{error}</li>
      ))}
    </ul>
  );
}

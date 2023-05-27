type Props = React.InputHTMLAttributes<HTMLInputElement>;

import "./SearchInput.css";

export function SearchInput(props: Props) {
  return <input className="input" {...props} />;
}

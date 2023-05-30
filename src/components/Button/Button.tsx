import "./Button.css";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ children, ...props }: Props) {
  return (
    <button {...props} className="button">
      <span className="button-content">{children}</span>
    </button>
  );
}

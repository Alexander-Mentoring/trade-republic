import classNames from "classnames";
import "./ErrorBanner.css";

type ErrorType = "warning" | "error";

export type ErrorBannerError = {
  title: string;
  message: string;
  type: ErrorType;
};

type Props = ErrorBannerError;

export function ErrorBanner(props: Props) {
  const className = classNames("errorBanner", {
    "errorBanner--warning": props.type === "warning",
    "errorBanner--error": props.type === "error",
  });
  return <div className={className}>{props.message}</div>;
}

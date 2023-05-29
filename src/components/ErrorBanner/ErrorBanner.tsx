import "./ErrorBanner.css";

type ErrorType = "warning" | "error";

export type ErrorBannerError = {
  title: string;
  message: string;
  type: ErrorType;
};

type Props = ErrorBannerError;

export function ErrorBanner(props: Props) {
  return (
    <div className="errorBanner--warning">
      <div>{props.title}</div>
      <div>{props.message}</div>
    </div>
  );
}

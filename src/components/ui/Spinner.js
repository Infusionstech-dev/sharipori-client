import clsx from "clsx";

export default function Spinner({ className = "size-5 text-primary", label = "Loading" }) {
  return (
    <span role="status" className="inline-flex">
      <span
        aria-hidden="true"
        className={clsx(
          "animate-spin rounded-full border-2 border-current border-t-transparent",
          className
        )}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}

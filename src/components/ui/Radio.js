import clsx from "clsx";

export default function Radio({ label, className, ...props }) {
  return (
    <label className={clsx("inline-flex min-h-11 items-center gap-2 text-sm", className)}>
      <input
        type="radio"
        className="size-5 accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        {...props}
      />
      {label}
    </label>
  );
}

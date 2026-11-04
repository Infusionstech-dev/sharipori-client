import clsx from "clsx";

const VARIANTS = {
  soft: "bg-soft text-primary",
  primary: "bg-primary text-white",
  accent: "bg-accent text-text",
  neutral: "bg-text/10 text-text",
};

export default function Badge({ variant = "soft", className, children, ...props }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        VARIANTS[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

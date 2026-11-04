import clsx from "clsx";

export default function EmptyState({ icon, title, description, action, className }) {
  return (
    <div className={clsx("flex flex-col items-center gap-3 rounded-lg bg-soft/50 p-8 text-center", className)}>
      {icon}
      <h3 className="font-display text-xl text-primary">{title}</h3>
      {description && <p className="max-w-md text-sm text-text/70">{description}</p>}
      {action}
    </div>
  );
}

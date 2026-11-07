import clsx from "clsx";

export default function RadioCard({ checked, title, detail, aside, ...props }) {
  return (
    <label
      className={clsx(
        "flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary",
        checked ? "border-primary bg-soft" : "border-text/20 hover:border-primary"
      )}
    >
      <input type="radio" className="size-5 accent-primary" checked={checked} {...props} />
      <span className="flex-1">
        <span className="block text-sm font-medium">{title}</span>
        {detail && <span className="block text-xs text-text/70">{detail}</span>}
      </span>
      {aside && <span className="text-sm font-semibold">{aside}</span>}
    </label>
  );
}

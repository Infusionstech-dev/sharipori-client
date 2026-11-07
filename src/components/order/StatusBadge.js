import clsx from "clsx";

export const STATUS = {
  pending: { label: "Pending", className: "bg-gray-100 text-gray-800" },
  confirmed: { label: "Confirmed", className: "bg-blue-100 text-blue-800" },
  processing: { label: "Processing", className: "bg-amber-100 text-amber-900" },
  shipped: { label: "Shipped", className: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", className: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-800" },
  returned: { label: "Returned", className: "bg-gray-700 text-white" },
};

export default function StatusBadge({ status, className }) {
  const style = STATUS[status] ?? { label: status, className: "bg-gray-100 text-gray-800" };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        style.className,
        className
      )}
    >
      {style.label}
    </span>
  );
}

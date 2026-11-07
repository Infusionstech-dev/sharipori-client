import { Check, X } from "lucide-react";
import clsx from "clsx";
import { STATUS } from "./StatusBadge";

// The usual path an order takes. Steps not reached yet are shown faded.
const FLOW = ["pending", "confirmed", "processing", "shipped", "delivered"];

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Asia/Dhaka",
});

// timeline: [{ status, at }] from the API, oldest first.
export default function OrderTimeline({ timeline }) {
  const reached = new Map(timeline.map((step) => [step.status, step.at]));
  const ended = timeline.find((step) => ["cancelled", "returned"].includes(step.status));
  const steps = ended
    ? timeline.map((step) => step.status)
    : FLOW.filter((status) => FLOW.indexOf(status) >= 0);

  return (
    <ol className="space-y-0">
      {steps.map((status, index) => {
        const at = reached.get(status);
        const isEnd = status === "cancelled" || status === "returned";
        const last = index === steps.length - 1;
        return (
          <li key={status} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && (
              <span
                aria-hidden="true"
                className={clsx(
                  "absolute left-3 top-6 h-full w-0.5 -translate-x-1/2",
                  at ? "bg-primary" : "bg-soft"
                )}
              />
            )}
            <span
              aria-hidden="true"
              className={clsx(
                "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full",
                at && isEnd && "bg-red-700 text-white",
                at && !isEnd && "bg-primary text-white",
                !at && "border-2 border-soft bg-white"
              )}
            >
              {at && (isEnd ? <X className="size-3.5" /> : <Check className="size-3.5" />)}
            </span>
            <span className={clsx("text-sm", !at && "text-text/50")}>
              <span className="block font-medium">{STATUS[status]?.label ?? status}</span>
              {at ? (
                <time dateTime={at} className="block text-xs text-text/70">
                  {timeFormat.format(new Date(at))}
                </time>
              ) : (
                <span className="sr-only">Not yet</span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

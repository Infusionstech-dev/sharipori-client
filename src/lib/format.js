// Locale and time zone are fixed so server and browser render identical text.
const numberFormat = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 });

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

export function formatBDT(amount) {
  const value = Number(amount);
  return Number.isFinite(value) ? `৳ ${numberFormat.format(value)}` : "";
}

export function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormat.format(date);
}

import { z } from "zod";

// These mirror the backend's validation/authValidation.js.
export const phoneRule = z
  .string()
  .trim()
  .regex(/^01[3-9]\d{8}$/, "Enter a valid 01XXXXXXXXX number");

export const passwordRule = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters")
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/\d/, "Password must contain a number");

// Puts API field errors on the form. Returns false when there were none to show.
export const applyServerErrors = (err, setError) => {
  const details = Array.isArray(err?.data?.details) ? err.data.details : [];
  details.forEach(({ field, message }) => setError(field, { message }));
  return details.length > 0;
};

export const serverMessage = (err, fallback) =>
  err?.data?.message ?? fallback ?? "Could not reach the server. Please try again.";

// Only same-site paths, so a crafted ?next= link cannot send users to another website.
export const safeNextPath = (next) =>
  next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\")
    ? next
    : "/account";

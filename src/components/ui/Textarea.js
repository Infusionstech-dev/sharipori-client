"use client";

import clsx from "clsx";
import Field, { controlClass } from "./Field";

export default function Textarea({ id, label, hint, error, rows = 4, className, ...props }) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      {(fieldProps) => (
        <textarea rows={rows} className={clsx(controlClass, className)} {...fieldProps} {...props} />
      )}
    </Field>
  );
}

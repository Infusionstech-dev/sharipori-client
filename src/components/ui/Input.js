"use client";

import clsx from "clsx";
import Field, { controlClass } from "./Field";

export default function Input({ id, label, hint, error, className, ...props }) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      {(fieldProps) => <input className={clsx(controlClass, className)} {...fieldProps} {...props} />}
    </Field>
  );
}

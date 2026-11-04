"use client";

import clsx from "clsx";
import Field, { controlClass } from "./Field";

export default function Select({
  id,
  label,
  hint,
  error,
  options = [],
  placeholder,
  className,
  ...props
}) {
  return (
    <Field id={id} label={label} hint={hint} error={error}>
      {(fieldProps) => (
        <select className={clsx(controlClass, className)} {...fieldProps} {...props}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}

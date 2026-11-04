"use client";

import clsx from "clsx";
import DialogPanel from "./DialogPanel";

export default function Modal({ className, ...props }) {
  return (
    <DialogPanel
      className={clsx("m-auto w-[calc(100%-2rem)] max-w-lg rounded-lg", className)}
      {...props}
    />
  );
}

"use client";

import clsx from "clsx";
import DialogPanel from "./DialogPanel";

const SIDES = {
  left: "mr-auto",
  right: "ml-auto",
};

export default function Drawer({ side = "right", className, ...props }) {
  return (
    <DialogPanel
      className={clsx("h-dvh max-h-none w-[85%] max-w-sm", SIDES[side], className)}
      {...props}
    />
  );
}

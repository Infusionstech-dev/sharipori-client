"use client";

import { useEffect, useId, useRef } from "react";
import clsx from "clsx";

// Native <dialog> gives Modal and Drawer focus trapping, Escape and focus restore.
export default function DialogPanel({ open, onClose, title, className, children }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!open) {
      return undefined;
    }

    dialog.showModal();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          onClose();
        }
      }}
      className={clsx("bg-white p-0 text-text backdrop:bg-black/50", className)}
    >
      <div className="flex min-h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-soft p-4">
          <h2 id={titleId} className="font-display text-xl text-primary">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-lg text-2xl leading-none hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="flex-1 p-4">{children}</div>
      </div>
    </dialog>
  );
}

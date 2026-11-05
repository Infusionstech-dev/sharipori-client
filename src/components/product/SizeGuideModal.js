"use client";

import { useState } from "react";
import clsx from "clsx";
import Modal from "@/components/ui/Modal";
import { SIZE_GUIDE } from "@/lib/sizeGuide";

export default function SizeGuideModal({ open, onClose, initialGroup }) {
  const [group, setGroup] = useState(SIZE_GUIDE[initialGroup] ? initialGroup : "baby");
  const guide = SIZE_GUIDE[group];

  return (
    <Modal open={open} onClose={onClose} title="Size guide">
      <div className="mb-4 flex gap-2">
        {Object.entries(SIZE_GUIDE).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            aria-pressed={key === group}
            onClick={() => setGroup(key)}
            className={clsx(
              "min-h-11 flex-1 rounded-lg border text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              key === group ? "border-primary bg-soft font-medium text-primary" : "border-text/25"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-soft">
            {guide.columns.map((column) => (
              <th key={column} scope="col" className="py-2 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {guide.rows.map(([size, ...values]) => (
            <tr key={size} className="border-b border-soft last:border-0">
              <th scope="row" className="py-2 font-medium">
                {size}
              </th>
              {values.map((value) => (
                <td key={value} className="py-2">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Modal>
  );
}

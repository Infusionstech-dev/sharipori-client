"use client";

import { Toaster } from "react-hot-toast";

// Offset below the header so toasts never cover the account menu.
export default function AppToaster() {
  return <Toaster position="top-center" containerStyle={{ top: 104 }} />;
}

"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

export default function StoreProvider({ children }) {
  // A store per request, so one visitor's data never leaks into another's server render.
  const [store] = useState(makeStore);

  return <Provider store={store}>{children}</Provider>;
}

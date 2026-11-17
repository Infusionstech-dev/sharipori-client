import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// False while the server renders and while the browser hydrates, then true. Anything that reads
// browser-only data (like the saved wishlist) waits for it, so the first browser render matches
// the server's HTML. React leaves a mismatched attribute as the server wrote it.
export default function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

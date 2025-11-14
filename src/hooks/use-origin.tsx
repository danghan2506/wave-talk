import { useSyncExternalStore } from "react";
// safely get the current origin (protocol + domain) on the client side.
export const useOrigin = () => {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true, // Client-side: true (đã mounted)
    () => false // Server-side: false (chưa mounted)
  );

  if (!isMounted) return null;
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  return origin;
};

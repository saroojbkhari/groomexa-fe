import { useCallback, useEffect, useState } from "react";

/** A countdown for "you can try again in N s" buttons. `start()` begins it; `remaining` is 0 when it's over. */
export default function useCooldown(seconds: number) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining]);

  const start = useCallback(() => setRemaining(seconds), [seconds]);

  return { remaining, start };
}

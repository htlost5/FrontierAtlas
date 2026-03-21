import { useEffect, useState } from "react";

export default function usePrepareData(baseReady: boolean) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!baseReady) return;

    setTimeout(() => setReady(true), 2000);
  }, [baseReady]);

  return ready;
}

const SIMULATE_OFFLINE = true;

export async function safeFetch(url: string, options?: RequestInit) {
  if (SIMULATE_OFFLINE) {
    throw new Error("Simulated offline network error");
  }

  const overrideOption: RequestInit = {
    cache: "no-cache",
    ...options,
  };

  return fetch(url, overrideOption);
}

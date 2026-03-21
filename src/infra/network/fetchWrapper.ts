const SIMULATE_OFFLINE = false;

export async function safeFetch(url: string, options?: RequestInit) {
  if (SIMULATE_OFFLINE) {
    throw new Error("Simulated offline network error");
  }

  return fetch(url, options);
}

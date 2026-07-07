// jsonParser のインフラ層実装を提供する。
export function stringifyJson<T>(data: T): string {
  try {
    return JSON.stringify(data);
  } catch (e) {
    throw new Error(`Failed to stringify JSON: ${e}`);
  }
}

export function parseJson<T = unknown>(data: string): T {
  try {
    return JSON.parse(data) as T;
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${e}`);
  }
}

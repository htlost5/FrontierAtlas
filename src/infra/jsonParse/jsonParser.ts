export function stringifyJson(data: any): string {
  try {
    return JSON.stringify(data);
  } catch (e) {
    throw new Error(`Failed to stringify JSON: ${e}`);
  }
}

export function parseJson(data: string): any {
  try {
    return JSON.parse(data);
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${e}`);
  }
}

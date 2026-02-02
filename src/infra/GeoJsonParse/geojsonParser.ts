function stringifyJson(data: any): string {
  try {
    return JSON.stringify(data);
  } catch (e) {
    throw new Error(`Failed to stringify JSON: ${e}`);
  }
}

function parseJson(data: any): any {
  try {
    return JSON.parse(data);
  } catch (e) {
    throw new Error(`Failed to parse JSON: ${e}`);
  }
}

export { parseJson, stringifyJson };


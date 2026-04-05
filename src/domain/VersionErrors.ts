export class VersionFetchError extends Error {
  constructor() {
    super("Version fetch error");
    this.name = "VersionFetchError";
  }
}

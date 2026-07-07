// VersionErrors のドメインエラー/型を定義する。
export class VersionFetchError extends Error {
  constructor() {
    super("Version fetch error");
    this.name = "VersionFetchError";
  }
}

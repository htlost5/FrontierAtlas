// パッケージ及びURL管理

type AppDef = {
  androidPackage: string;
  webUrl: string;
}

export const EXTERNAL_APPS: Record<string, AppDef> = {
  classroom: {
    androidPackage: "classroom.google.com",
    webUrl: "https://classroom.google.com/",
  },
} as const;

export type ExternalAppKey = keyof typeof EXTERNAL_APPS;
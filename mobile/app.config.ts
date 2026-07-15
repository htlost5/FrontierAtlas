import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const profile = process.env.EAS_BUILD_PROFILE || "development";

  const isDev = profile === "development";
  const isProd = profile === "production";

  const bundleSuffix = isDev ? ".dev" : "";

  const appName = isDev ? "FrontierAtlas (Dev)" : "FrontierAtlas";

  return {
    ...config,

    name: appName,

    slug: "FrontierAtlas",
    scheme: "frontieratlas",
    version: config.version || "0.17.1",

    orientation: "portrait",
    icon: "./assets/images/startup/FrontierAtlasLogo_Splash_white.png",
    userInterfaceStyle: "automatic",

    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: `com.htlost.frontieratlas${bundleSuffix}`,
    },

    android: {
      ...config.android,
      package: `com.htlost.frontieratlas${bundleSuffix}`,
      adaptiveIcon: {
        foregroundImage:
          "./assets/images/startup/FrontierAtlasLogo_Splash_white.png",
        backgroundColor: "#ffffff",
      },
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/startup/FrontierAtlasLogo_Splash_white.png",
    },

    plugins: [
      "expo-image",
      "expo-status-bar",
      "expo-web-browser",
      [
        "expo-font",
        {
          fonts: ["./assets/fonts/Y1LunaChord.otf"],
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 36,
            targetSdkVersion: 36,
          },
        },
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/startup/FrontierAtlasLogo_Splash_white.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            image: "./assets/images/startup/FrontierAtlasLogo_Splash_black.png",
            backgroundColor: "#000000",
          },
        },
      ],
      [
        "expo-router",
        {
          root: "./app",
        },
      ],
      "expo-sqlite",
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      ...config.extra,
      router: {},
      eas: {
        projectId: "1b6e78b6-c7c3-4760-b085-bb85043c0650",
      },
    },

    runtimeVersion: {
      policy: "appVersion",
    },

    updates: {
      url: "https://u.expo.dev/1b6e78b6-c7c3-4760-b085-bb85043c0650",
      enabled: isProd,
    },
  };
};

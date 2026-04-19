import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const profile = process.env.EAS_BUILD_PROFILE || "development";

  const isDev = profile === "development";
  const isPreview = profile === "preview";
  const isProd = profile === "production";

  const bundleSuffix = isDev ? ".dev" : isPreview ? ".preview" : "";

  const appName = isDev
    ? "FrontierAtlas (Dev)"
    : isPreview
      ? "FrontierAtlas (Preview)"
      : "FrontierAtlas";

  return {
    ...config,

    name: appName,

    slug: "frontieratlas",
    scheme: "frontieratlas",
    version: config.version || "1.0.0",

    orientation: "portrait",
    icon: "./assets/images/startup/FrontierAtlasLogo_Splash_white.png",
    userInterfaceStyle: "automatic",
    jsEngine: "hermes",

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
      [
        "expo-font",
        {
          fonts: [
            {
              fontFamily: "Y1LunaChord",
              fontDefinitions: [
                {
                  path: "./assets/fonts/Y1LunaChord.otf",
                  weight: 800,
                },
              ],
            },
          ],
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
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
      enabled: isProd || isPreview,
    },
  };
};

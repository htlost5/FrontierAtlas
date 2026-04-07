import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const profile = process.env.EAS_BUILD_PROFILE;

  const isDev = profile === "development";
  const isDebug = profile === "standaloneDev";
  const isProd = profile === "production";

  return {
    ...config,

    name: isDev
      ? "FrontierAtlas Dev"
      : isDebug
        ? "FrontierAtlas Debug"
        : "FrontierAtlas Prod",

    slug: "FrontierAtlas",
    version: config.version,

    orientation: "portrait",
    icon: "./assets/images/startup/FrontierAtlasLogo_Splash_white.png",
    scheme: "frontieratlas",
    userInterfaceStyle: "automatic",
    jsEngine: "hermes",
    newArchEnabled: true,

    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: isDev
        ? "com.htlost.frontieratlas.dev"
        : isDebug
          ? "com.htlost.frontieratlas.debug"
          : "com.htlost.frontieratlas.prod",
    },

    android: {
      package: isDev
        ? "com.htlost.frontieratlas.dev"
        : isDebug
          ? "com.htlost.frontieratlas.debug"
          : "com.htlost.frontieratlas.prod",

      versionCode: isProd ? 1507 : 1506,

      adaptiveIcon: {
        foregroundImage:
          "./assets/images/startup/FrontierAtlasLogo_Splash_white.png",
        backgroundColor: "#ffffff",
      },

      edgeToEdgeEnabled: true,

      /**
       * 🔥 ここが重要
       * standaloneDev だけデバッグ可能にする
       */
      ...(isDebug && {
        debuggable: true,
      }),
    },

    splash: {
      image: "./assets/images/startup/FrontierAtlasLogo_Splash_white.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
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
        "expo-router",
        {
          root: "./app",
        },
      ],
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,

            /**
             * optional: debugビルドの安定化
             */
            ...(isDebug && {
              buildToolsVersion: "35.0.0",
            }),
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
        },
      ],
      "@maplibre/maplibre-react-native",
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
      /**
       * standaloneDevではOTA無効にするのも推奨
       */
      ...(isDebug && {
        enabled: false,
      }),
    },
  };
};

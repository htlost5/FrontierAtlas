import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  // 現在のビルドプロファイルを判定
  const profile = process.env.EAS_BUILD_PROFILE;
  const isDev = profile === "development";
  const isProd = profile === "production";

  return {
    ...config,
    // アプリ名と slug
    name: isDev ? "FrontierAtlas Dev" : "FrontierAtlas Prod",
    slug: "FrontierAtlas",

    version: config.version, // 既存の version を使用

    orientation: "portrait",
    icon: "./assets/images/startup/FrontierAtlasLogo_Splash_white.png",
    scheme: "frontieratlas",
    userInterfaceStyle: "automatic",
    jsEngine: "hermes",
    newArchEnabled: false,

    ios: {
      ...config.ios,
      supportsTablet: true,
      bundleIdentifier: isDev
        ? "com.htlost.frontieratlas.dev"
        : "com.htlost.frontieratlas.prod",
    },

    android: {
      // プロファイルごとに package と versionCode を切り替え
      package: isDev
        ? "com.htlost.frontieratlas.dev"
        : "com.htlost.frontieratlas.prod",
      versionCode: isProd ? 1507 : 1506, // 必要に応じて数字を調整

      adaptiveIcon: {
        foregroundImage:
          "./assets/images/startup/FrontierAtlasLogo_Splash_white.png",
        backgroundColor: "#ffffff",
      },

      edgeToEdgeEnabled: true,
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
      "expo-router",
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
    },
  };
};

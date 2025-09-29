import 'dotenv/config';

export default ({ config }) => {
  // 現在のビルドプロファイルを判定
  const profile = process.env.EAS_BUILD_PROFILE;
  const isDev = profile === 'development';
  const isProd = profile === 'production';

  return {
    ...config,
    // アプリ名と slug
    name: isDev ? 'FrontierAtlas Dev' : 'FrontierAtlas Prod',
    slug: 'FrontierAtlas',

    version: config.version, // 既存の version を使用（例: 0.15.6）

    orientation: 'portrait',
    icon: './assets/images/startup/FrontierAtlasLogo_splash_white.png',
    scheme: 'frontieratlas',
    userInterfaceStyle: 'automatic',
    jsEngine: 'hermes',
    newArchEnabled: false,

    ios: {
      ...config.ios,
      supportsTablet: true,
    },

    android: {
      // プロファイルごとに package と versionCode を切り替え
      package: isDev ? 'com.htlost.frontieratlas.dev' : 'com.htlost.frontieratlas.product',
      versionCode: isProd ? 1507 : 1506, // 必要に応じて数字を調整

      adaptiveIcon: {
        foregroundImage: './assets/images/startup/FrontierAtlasLogo_splash_white.png',
        backgroundColor: '#ffffff',
      },
      splash: {
        image: './assets/images/startup/FrontierAtlasLogo_splash_white.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },

    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/startup/FrontierAtlasLogo_splash_white.png',
    },

    plugins: [
      'expo-router',
      [
        'expo-build-properties',
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
          },
        },
      ],
      [
        'expo-splash-screen',
        {
          image: './assets/images/startup/FrontierAtlasLogo_splash_white.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
      'expo-asset',
      'expo-web-browser',
    ],

    experiments: {
      typedRoutes: true,
    },

    extra: {
      ...config.extra,
      router: {},
      eas: {
        projectId: '1b6e78b6-c7c3-4760-b085-bb85043c0650',
      },
    },

    runtimeVersion: {
      policy: 'appVersion',
    },

    updates: {
      url: 'https://u.expo.dev/1b6e78b6-c7c3-4760-b085-bb85043c0650',
    },
  };
};

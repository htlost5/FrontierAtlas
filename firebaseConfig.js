import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

// Firebase コンソールから取得した設定をここに貼り付けます
const firebaseConfig = {
  apiKey: "AIzaSyABggesAXzY4PGwL18zMdI0vpubM0SrkZs", // FirebaseプロジェクトのウェブAPIキー
  authDomain: "frontieratlas-65e41.firebaseapp.com",
  projectId: "frontieratlas-65e41",
  storageBucket: "frontieratlas-65e41.firebasestorage.app",
  messagingSenderId: "238337449471",
  appId: "1:238337449471:android:d2742558a3b8c3309c1bca", 
  measurementId: "G-M5NYS999K4",
  webClientId: "238337449471-9t779fslkasjgrh7gvkbmm9r0m8anq6u.apps.googleusercontent.com",
  androidClientId: "238337449471-8k0p6k9qfk8abtr4dfgoalju25q5ivm8.apps.googleusercontent.com",
};

// Firebase アプリを初期化
const app = initializeApp(firebaseConfig);

// 認証サービスを取得
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, auth, firebaseConfig };
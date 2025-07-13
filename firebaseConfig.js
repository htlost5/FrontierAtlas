// src/firebase/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Firebase Authentication サービスをインポート

// Firebase コンソールから取得した設定をここに貼り付けます
const firebaseConfig = {
  apiKey: "AIzaSyABggesAXzY4PGwL18zMdI0vpubM0SrkZs", // FirebaseプロジェクトのウェブAPIキー
  authDomain: "frontieratlas-65e41.firebaseapp.com",
  projectId: "frontieratlas-65e41",
  storageBucket: "frontieratlas-65e41.firebasestorage.app",
  messagingSenderId: "238337449471",
  appId: "1:238337449471:android:d2742558a3b8c3309c1bca", 
  measurementId: "G-M5NYS999K4"
};

// Firebase アプリを初期化
const app = initializeApp(firebaseConfig);

// 認証サービスを取得
const auth = getAuth(app);

export { app, auth };
// components/AppInit.tsx
import * as Google from "expo-auth-session/providers/google";
import * as SplashScreen from "expo-splash-screen";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { auth, firebaseConfig } from "../firebaseConfig";


WebBrowser.maybeCompleteAuthSession();


type Props = {
  children: React.ReactNode;
};

export default function AppInit({ children }: Props) {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: firebaseConfig.webClientId,
    androidClientId: firebaseConfig.androidClientId,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      if (response.authentication && response.authentication.idToken) {
        const idToken = response.authentication.idToken;
        const credential = GoogleAuthProvider.credential(idToken);
        signInWithCredential(auth, credential)
          .then(() => {
            console.log("Googleログインに成功しました！");
          })
          .catch((error) => {
            console.error("Googleログインエラー:", error);
            setIsLoadingAuth(false);
          });
      } else {
        console.error("Google認証は成功しましたが、idTokenが見つかりません。");
        setIsLoadingAuth(false);
      }
    } else if (response?.type === 'cancel' || response?.type === 'dismiss') {
      console.log("Googleログインがキャンセルされました。");
      setIsLoadingAuth(false);
    } else if (response?.type === 'error') {
      console.error("Google認証エラー", response.error);
      setIsLoadingAuth(false);
    }
  }, [response]);

  useEffect(() => {
    async function prepare() {
      try {
        // スプラッシュ画面を自動非表示しないようにロック
        await SplashScreen.preventAutoHideAsync();

        // ここでフォントやAPIの初期化をやる（必要に応じて）
        // await Font.loadAsync(...);
        // await fetchInitialData();

      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (!isLoadingAuth && isReady) {
      SplashScreen.hideAsync();
    }
  }, [isLoadingAuth, isReady]);

  useEffect(() => {
    if (!isLoadingAuth) {
      setIsReady(true);
    }
  }, [isLoadingAuth]);

  if (!isReady || isLoadingAuth) {
    // スプラッシュ画面のまま何も表示しない
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>認証状態を確認中...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>ログインしてください</Text>
        <Button
          title="Googleでログイン"
          disabled={!request}
          onPress={() => {
            setIsLoadingAuth(true);
            promptAsync().catch(error => {
              console.error("Google認証プロンプトエラー:", error);
              setIsLoadingAuth(false);
            });
          }}
        />
      </View>
    );
  }

  // 初期化完了後は通常画面を表示
  return(
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
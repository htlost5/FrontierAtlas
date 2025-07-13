import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

const googleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    const idToken = userInfo?.idToken || userInfo?.data?.idToken;
    const credential = GoogleAuthProvider.credential(idToken);
    await signInWithCredential(auth, credential);
    router.replace('特定の画面パス');
  } catch (error) {
    console.error("Google Sign-In Error", error);
  }
};
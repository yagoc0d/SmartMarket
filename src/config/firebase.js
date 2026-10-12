import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCm_2-YSjNMq7CiRJlnbl5uZ7jxkRzexFk",
  authDomain: "teste-4c2fc.firebaseapp.com",
  projectId: "teste-4c2fc",
  storageBucket: "teste-4c2fc.firebasestorage.app",
  messagingSenderId: "874358124572",
  appId: "1:874358124572:web:ba78da95c9219b0954afd9",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);

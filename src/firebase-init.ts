import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "mapeo-webmaps-staging",
  appId: "1:354071501370:web:a92ea6497d55c4dd9ab303",
  storageBucket: "mapeo-webmaps-staging.appspot.com",
  apiKey: "AIzaSyAddUwtJxCTq3VImtID0S-5beOHiJtKTe4",
  authDomain: "mapeo-webmaps-staging.firebaseapp.com",
  messagingSenderId: "354071501370",
  measurementId: "G-GLMDFRWPJD",
}

export const firebaseApp = initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp)
export const auth = getAuth();
import { initializeApp, FirebaseApp } from "firebase/app";
import * as ReactDOM from 'react-dom'
import { Auth, getAuth } from "firebase/auth";
import { enableIndexedDbPersistence, Firestore, getFirestore } from "firebase/firestore";

import { App } from "./components/App";
import * as serviceWorker from "./serviceWorker";

const devConfig = {
  projectId: "mapeo-webmaps-staging",
  appId: "1:354071501370:web:a92ea6497d55c4dd9ab303",
  storageBucket: "mapeo-webmaps-staging.appspot.com",
  apiKey: "AIzaSyAddUwtJxCTq3VImtID0S-5beOHiJtKTe4",
  authDomain: "mapeo-webmaps-staging.firebaseapp.com",
  messagingSenderId: "354071501370",
  measurementId: "G-GLMDFRWPJD",
}

const getConfig = () => fetch("/__/firebase/init.json").then(async (response) => response.json())

export let db: Firestore
export let auth: Auth

export let firebaseApp: FirebaseApp

async function init() {
  const config = process.env.NODE_ENV === "development" ? devConfig : await getConfig()
  firebaseApp = initializeApp(config)
  db = getFirestore(firebaseApp);
  auth = getAuth()

  // For some reason, if we don't call this here, writes fail silently in the app
  // Enables offline persistence
  enableIndexedDbPersistence(db)

  ReactDOM.render(<App />, document.getElementById("root"))
}

init()

// init();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

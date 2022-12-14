import * as React from "react";
import * as ReactDOM from "react-dom";
import {getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence} from "firebase/firestore";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

import App from "./components/App";
import * as serviceWorker from "./serviceWorker";

if (process.env.NODE_ENV === "development") {
  // Use staging credentials when running locally
  init({
    projectId: "mapeo-webmaps-staging",
    appId: "1:354071501370:web:a92ea6497d55c4dd9ab303",
    storageBucket: "mapeo-webmaps-staging.appspot.com",
    apiKey: "AIzaSyAddUwtJxCTq3VImtID0S-5beOHiJtKTe4",
    authDomain: "mapeo-webmaps-staging.firebaseapp.com",
    messagingSenderId: "354071501370",
    measurementId: "G-GLMDFRWPJD",
  });
} else {
  // Get credentials according to environment (production, staging)
  // https://firebase.google.com/docs/hosting/reserved-urls
  fetch("/__/firebase/init.json").then(async (response) => {
    init(await response.json());
  });
}

function init(firebaseConfig:FirebaseOptions) {
  const app = initializeApp(firebaseConfig)

  const db = getFirestore(app)
  const auth = getAuth();


  if (process.env.NODE_ENV === "development") {
    // Use emulated firestore and auth when running locally
    connectFirestoreEmulator(db,"localhost", 8080);
    connectAuthEmulator(auth,"http://localhost:9099/");
  }

  // For some reason, if we don't call this here, writes fail silently in the app
  // Enables offline persistence
  enableIndexedDbPersistence(db)

  ReactDOM.render(<App />, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

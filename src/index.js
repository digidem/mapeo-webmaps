import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

if (process.env.NODE_ENV === "development") {
  // Use staging credentials when running locally
  init({
    projectId: "mapeo-webmaps-staging",
    appId: "1:354071501370:web:a92ea6497d55c4dd9ab303",
    storageBucket: "mapeo-webmaps-staging.appspot.com",
    locationId: "us-central",
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

function init(firebaseConfig) {
  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();

  if (process.env.NODE_ENV === "development") {
    // Use emulated firestore and auth when running locally
    db.useEmulator("localhost", 8080);
    firebase.auth().useEmulator("http://localhost:9099/");
  }

  // For some reason, if we don't call this here, writes fail silently in the app
  // Enables offline persistence
  db.enablePersistence();

  ReactDOM.render(<App />, document.getElementById("root"));
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

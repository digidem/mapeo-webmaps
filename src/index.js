import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

const PROJECT_ID = "mapeo-webmaps";

firebase.initializeApp({
  apiKey: "AIzaSyCmZDMJqOuHxSAeIXbgBEBnieoVdaoEBCM",
  authDomain: `${PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${PROJECT_ID}.firebaseio.com`,
  projectId: PROJECT_ID,
  storageBucket: `${PROJECT_ID}.appspot.com`,
  messagingSenderId: "826232651428",
  appId: "1:826232651428:web:dba2488c5655222e",
});

const db = firebase.firestore();

// Use emulated firestore and auth when running locally (detected from a non-80 port in the URL)
if (window.location.port && window.location.port !== "80") {
  db.useEmulator("localhost", 8080);
  firebase.auth().useEmulator("http://localhost:9099/");
}

// For some reason, if we don't call this here, writes fail silently in the app
// Enables offline persistence
db.enablePersistence();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase/app";

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

import App from "./App";
import * as serviceWorker from "./serviceWorker";

firebase.initializeApp({
  apiKey: "AIzaSyCmZDMJqOuHxSAeIXbgBEBnieoVdaoEBCM",
  authDomain: "mapeo-webmaps.firebaseapp.com",
  databaseURL: "https://mapeo-webmaps.firebaseio.com",
  projectId: "mapeo-webmaps",
  storageBucket: "mapeo-webmaps.appspot.com",
  messagingSenderId: "826232651428",
  appId: "1:826232651428:web:dba2488c5655222e"
});

// For some reason, if we don't call this here, writes fail silently in the app
// Enables offline persistence
firebase.firestore().enablePersistence();

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();

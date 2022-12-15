import { initializeApp, FirebaseApp, FirebaseOptions } from "firebase/app";
import * as ReactDOM from "react-dom";
import { connectFirestoreEmulator, enableIndexedDbPersistence } from "firebase/firestore";
import { connectAuthEmulator } from "firebase/auth";

import { App } from "./components/App";
import * as serviceWorker from "./serviceWorker";
import { auth, db } from "./firebase-init";


if (process.env.NODE_ENV === "development") {
  // Use emulated firestore and auth when running locally
  connectFirestoreEmulator(db, "localhost", 8080);
  connectAuthEmulator(auth, "http://localhost:9099/");
}


// Enables offline persistence
enableIndexedDbPersistence(db)

// Render React app
ReactDOM.render(<App />, document.getElementById("root"));

// init();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

import React from "react";
import firebase from "firebase/app";
import Button from "@material-ui/core/Button";
import logo from "./logo.svg";
import "./Home.css";

function Home() {
  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <p>
          Edit <code>src/Home.js</code> and save to reload.
        </p>
        <Button
          variant="contained"
          color="primary"
          onClick={() => firebase.auth().signOut()}
        >
          Logout
        </Button>
      </header>
    </div>
  );
}

export default Home;

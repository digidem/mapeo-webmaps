import React from "react";
import firebase from "firebase/app";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import logo from "./logo.png";
import "./Home.css";

function Home() {
  return (
    <div className="Home">
      <header className="Home-header">
        <img src={logo} className="Home-logo" alt="logo" />
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Mapeo Maps.
        </Typography>
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

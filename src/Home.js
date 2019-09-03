import React from "react";
import firebase from "firebase/app";
import { Router, navigate } from "@reach/router";
import { makeStyles } from "@material-ui/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuthState } from "react-firebase-hooks/auth";

import logo from "./logo.png";
import AppBar from "./AppBar";

const LoadingScreen = () => {
  const classes = useStyles();
  return (
    <div className={classes.loading}>
      <CircularProgress className={classes.progress} />
    </div>
  );
};

export default function Home({ location }) {
  const [user, initializing] = useAuthState(firebase.auth());
  const classes = useStyles();
  // Is the user authorized to see this page? An unauthorised user can see any
  // path in the publicPaths map
  const isAuthorized = user || location.pathname.startsWith("/auth");

  React.useEffect(() => {
    if (isAuthorized || initializing) return;
    // Redirect unauthorized users to the login page, but keep state of where
    // they come from
    navigate("/auth/login", {
      replace: true,
      state: { from: location.pathname }
    });
  }, [isAuthorized, initializing, location]);

  return (
    <div className={classes.root}>
      <AppBar />
      {initializing || !isAuthorized ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth="sm" className={classes.container}>
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
        </Container>
      )}
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  },
  loading: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

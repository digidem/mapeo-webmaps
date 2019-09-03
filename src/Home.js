import React from "react";
import firebase from "firebase/app";
import { navigate } from "@reach/router";
import { makeStyles } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuthState } from "react-firebase-hooks/auth";

import AppBar from "./AppBar";
import DropArea from "./DropArea";

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
      <AppBar onLogoutClick={() => firebase.auth().signOut()} />
      {initializing || !isAuthorized ? (
        <LoadingScreen />
      ) : (
        <Container maxWidth="md" className={classes.container}>
          <DropArea />
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
    flexDirection: "column",
    padding: "3em 0"
  },
  loading: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }
});

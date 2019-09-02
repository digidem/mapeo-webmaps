import React from "react";
import { Router, navigate, Location } from "@reach/router";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import CssBaseline from "@material-ui/core/CssBaseline";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";

const LoadingScreen = () => {
  const classes = useStyles();
  return (
    <div className={classes.centered}>
      <CircularProgress className={classes.progress} />
    </div>
  );
};

const publicPaths = {
  "/login": true,
  "/signup": true,
  "/reset-password": true
};

const App = ({ location }) => {
  const [user, initializing] = useAuthState(firebase.auth());

  // Is the user authorized to see this page? An unauthorised user can see any
  // path in the publicPaths map
  const isAuthorized = user || publicPaths[location.pathname];

  React.useEffect(() => {
    if (isAuthorized || initializing) return;
    // Redirect unauthorized users to the login page, but keep state of where
    // they come from
    navigate("/login", { replace: true, state: { from: location.pathname } });
  }, [isAuthorized, initializing, location]);

  if (initializing || !isAuthorized) return <LoadingScreen />;

  return (
    <>
      <CssBaseline />
      <Router>
        <Home path="/" />
        <Login path="/login" />
        <Signup path="/signup" />
        <ResetPassword path="/reset-password" />
      </Router>
    </>
  );
};

export default () => (
  <Location>{({ location }) => <App location={location} />}</Location>
);

const useStyles = makeStyles(theme => ({
  centered: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh"
  },
  progress: {
    margin: theme.spacing(2)
  }
}));

import React from "react";
import firebase from "firebase/app";
import { makeStyles } from "@material-ui/core/styles";
import { navigate } from "@reach/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { Router } from "@reach/router";
import CssBaseline from "@material-ui/core/CssBaseline";
import { IntlProvider } from "react-intl";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";
import AppBar from "./AppBar";
import LoadingScreen from "./LoadingScreen";

const translations = {
  es: require("./translations/es.json")
};

const Authorized = ({ location }) => {
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
      {initializing || !isAuthorized ? <LoadingScreen /> : <Home />}
    </div>
  );
};

const lang = navigator.language ? navigator.language.split("-")[0] : "en";

const App = () => (
  <IntlProvider locale={lang} messages={translations[lang]} defaultLocale="en">
    <CssBaseline />
    <Router>
      <Login path="/auth/login" />
      <Signup path="/auth/signup" />
      <ResetPassword path="/auth/reset-password" />
      <Authorized path="/*" />
    </Router>
  </IntlProvider>
);

export default App;

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
  }
});

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase/app";
import { Router, Link, navigate, RouteComponentProps } from "@reach/router"
import { IntlProvider } from 'react-intl';

import Login from '../../views/Login'
import ForgottenPassword from '../../views/ForgottenPassword';

import theme from '../../theme';
import { useEffect } from 'react';
import HomeView from '../../views/Home';
import Signup from '../../views/Signup';

const translations = {
  es: require("../../translations/es.json")
};

const Authorized = ({ location }: RouteComponentProps) => {
  const [user, initializing] = useAuthState(firebase.auth())
  // Is the user authorized to see this page? An unauthorised user can see any
  // path in the publicPaths map
  const isAuthorized = user || location?.pathname.startsWith("/auth")
  useEffect(() => {
    if (isAuthorized || initializing) return
    // Redirect unauthorized users to the login page, but keep state of where
    // they come from
    navigate("/auth/login", {
      replace: true,
      state: { from: location?.pathname }
    })
  }, [isAuthorized, initializing, location])

  return (
    <HomeView />
  );
};

const lang = navigator.language ? navigator.language.split("-")[0] : "en"

const App = () => (
  <IntlProvider locale={lang} messages={translations} defaultLocale="en">
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Router>
          <Login path="/auth/login" />
          <Signup path="/auth/signup" />
          <ForgottenPassword path="/auth/reset-password" />
          <Authorized path="/*" />
        </Router>

      </ThemeProvider>
    </>
  </IntlProvider>
);

export default App;


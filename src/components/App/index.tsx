import { ThemeProvider } from '@mui/material';

import CssBaseline from "@mui/material/CssBaseline";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";


import { Router, Link, navigate } from "@reach/router"

import Login from '../../views/Login'

import theme from '../../theme';
import { IntlProvider } from 'react-intl';
import { useEffect } from 'react';
import HomeView from '../../views/Home';
import { AuthorizedProps, translationsType } from './types';
import { firebaseApp } from '../../index';

const translations: translationsType = {
  es: require("../../translations/es.json")
};


const Authorized = ({ location }: AuthorizedProps) => {
  const auth = getAuth(firebaseApp);
  const [user, initializing] = useAuthState(auth);

  // Is the user authorized to see this page? An unauthorised user can see any
  // path in the publicPaths map
  const isAuthorized = user || location?.pathname.startsWith("/auth");
  useEffect(() => {
    if (isAuthorized || initializing) return;
    // Redirect unauthorized users to the login page, but keep state of where
    // they come from
    navigate("/auth/login", {
      replace: true,
      state: { from: location?.pathname }
    });
  }, [isAuthorized, initializing, location]);

  return (
    <HomeView />
  );
};

const lang = navigator.language ? navigator.language.split("-")[0] : "en";


const App = () => (
  // <IntlProvider locale={lang} messages={translations[lang]} defaultLocale="en">
  <>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <Router>
        <Login path="/auth/login" />
        <Authorized path="/*" />
        {/* <Signup path="/auth/signup" /> */}
        {/* <ResetPassword path="/auth/reset-password" /> */}
        {/* <Authorized path="/*" /> */}
      </Router>

    </ThemeProvider>
  </>
  // </IntlProvider>
);

export default App;


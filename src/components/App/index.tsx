import * as React from "react";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { Router, navigate } from "@reach/router";
import { IntlConfig, IntlProvider } from "react-intl";

import Login from "../../views/Login";
import theme from "../../theme";
import { HomeView } from "../../views/Home";
import { AuthorizedProps } from "./types";
import { firebaseApp } from "../../index";

type Translations = {
  es: IntlConfig["messages"];
  en: IntlConfig["messages"];
};

const translations: Translations = {
  es: require("../../translations/es.json"),
  en: require("../../translations/en.json"),
};

const navLang = navigator.language.split("-")[0];

const lang = isTranslation(navLang) ? navLang : "en";

function isTranslation(langugage?: string): langugage is keyof Translations {
  if (!langugage) return false;
  return Object.keys(translations).includes(langugage);
}

export const App = () => (
  <IntlProvider locale={lang} messages={translations[lang]} defaultLocale="en">
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
  </IntlProvider>
);

const Authorized = ({ location }: AuthorizedProps) => {
  const auth = getAuth(firebaseApp);
  const [user, initializing] = useAuthState(auth);

  // Is the user authorized to see this page? An unauthorised user can see any
  // path in the publicPaths map
  const isAuthorized = user || location?.pathname.startsWith("/auth");
  React.useEffect(() => {
    if (isAuthorized || initializing) return;
    // Redirect unauthorized users to the login page, but keep state of where
    // they come from
    navigate("/auth/login", {
      replace: true,
      state: { from: location?.pathname },
    });
  }, [isAuthorized, initializing, location]);

  return <HomeView />;
};
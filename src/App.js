import React from "react";
import { Router } from "@reach/router";
import CssBaseline from "@material-ui/core/CssBaseline";

import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import ResetPassword from "./ResetPassword";

const App = ({ location }) => (
  <>
    <CssBaseline />
    <Router>
      <Login path="/auth/login" />
      <Signup path="/auth/signup" />
      <ResetPassword path="/auth/reset-password" />
      <Home path="/*" />
    </Router>
  </>
);

export default App;

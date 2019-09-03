import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";

import RouterLink from "./RouterLink";
import { TextField, PasswordField } from "./Fields";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const errorTypes = {
  "auth/invalid-email": "email",
  "auth/user-disabled": "email",
  "auth/user-not-found": "email",
  "auth/wrong-password": "password"
};

export default function SignIn({ location }) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [user, authorizing, authError] = useAuthState(firebase.auth());

  useEffect(() => {
    const from = (location.state && location.state.from) || "/";
    if (user) navigate(from, { replace: true });
  }, [user, location]);

  if (authError) console.error(authError);
  const isEmailError = error && errorTypes[error.code] === "email";
  const isPasswordError = error && errorTypes[error.code] === "password";

  const login = e => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const persistence =
      firebase.auth.Auth.Persistence[remember ? "LOCAL" : "NONE"];
    firebase
      .auth()
      .setPersistence(persistence)
      .then(() => firebase.auth().signInWithEmailAndPassword(email, password))
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate onSubmit={login}>
          <TextField
            required
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            error={isEmailError}
            helperText={isEmailError && error.message}
            value={email}
            onValueChange={setEmail}
          />
          <PasswordField
            required
            error={isPasswordError}
            helperText={isPasswordError && error.message}
            value={password}
            onValueChange={setPassword}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
          />
          <Button
            data-testid="submit-button"
            type="submit"
            disabled={loading || authorizing}
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Login
          </Button>
          <Grid container>
            <Grid item xs>
              <RouterLink to="/reset-password" variant="body2">
                Forgot password?
              </RouterLink>
            </Grid>
            <Grid item>
              <RouterLink to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

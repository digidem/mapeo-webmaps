import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { navigate } from "@reach/router";

import RouterLink from "./RouterLink";
import { TextField, PasswordField } from "./Fields";

const errorTypes = {
  "auth/email-already-in-use": "email",
  "auth/invalid-email": "email",
  "auth/weak-password": "password"
};

export default function SignUp({ location }) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, authorizing] = useAuthState(firebase.auth());

  useEffect(() => {
    const from = (location.state && location.state.from) || "/";
    if (user) navigate(from, { replace: true });
  }, [user, location]);

  const isEmailError = error && errorTypes[error.code] === "email";
  const isPasswordError = error && errorTypes[error.code] === "password";

  const signup = e => {
    e.preventDefault();
    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={signup}>
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
          <Button
            type="submit"
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={loading || authorizing}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <RouterLink to="../login" variant="body2">
                Already have an account? Sign in
              </RouterLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}

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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

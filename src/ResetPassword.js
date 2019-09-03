import React, { useState, useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import firebase from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { navigate } from "@reach/router";
import BalanceText from "react-balance-text";

import RouterLink from "./RouterLink";
import { TextField } from "./Fields";

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

export default function ResetPassword({ location }) {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState();
  const [resetSent, setResetSent] = useState();
  const [user, authorizing] = useAuthState(firebase.auth());

  useEffect(() => {
    const from = (location.state && location.state.from) || "/";
    if (user) navigate(from, { replace: true });
  }, [user, location]);

  const sendLink = e => {
    e.preventDefault();
    setLoading(true);
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => setResetSent(true))
      .catch(setError)
      .finally(() => setLoading(false));
  };

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" gutterBottom>
          {resetSent ? "Email sent!" : "Password Reset"}
        </Typography>
        <Typography component={BalanceText} variant="body2" align="center">
          {resetSent ? (
            <>
              Check your <strong>{email}</strong> inbox for instructions from us
              on how to reset your password.
              <br />
              <br />
            </>
          ) : (
            "To reset your password, enter the email address you use to sign in"
          )}
        </Typography>
        {!resetSent && (
          <form className={classes.form} noValidate onSubmit={sendLink}>
            <TextField
              required
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!error}
              helperText={error && error.message}
              value={email}
              onValueChange={setEmail}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading || authorizing}
            >
              Get reset link
            </Button>
          </form>
        )}
        <Grid container justify="flex-end">
          <Grid item>
            <RouterLink to="../login" variant="body2">
              Return to login
            </RouterLink>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

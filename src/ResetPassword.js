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
import { defineMessages, useIntl } from "react-intl";

import RouterLink from "./RouterLink";
import { TextField } from "./Fields";

const msgs = defineMessages({
  email: {
    id: "email_label",
    defaultMessage: "Email Address"
  },
  initialTitle: {
    id: "password_reset_title",
    defaultMessage: "Password Reset"
  },
  successTitle: {
    id: "password_reset_success_title",
    defaultMessage: "Email sent!"
  },
  initialDescription: {
    id: "password_reset_desc",
    defaultMessage:
      "To reset your password, enter the email address you use to sign in"
  },
  successDescription: {
    id: "password_reset_success_desc",
    defaultMessage:
      "Check your {email} inbox for instructions from us on how to reset your password."
  },
  resetButton: {
    id: "password_reset_button",
    defaultMessage: "Get reset link"
  },
  login_link: {
    id: "return_to_login",
    defaultMessage: "Return to login"
  }
});

export default function ResetPassword({ location }) {
  const classes = useStyles();
  const { formatMessage } = useIntl();
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
          {resetSent
            ? formatMessage(msgs.successTitle)
            : formatMessage(msgs.initialTitle)}
        </Typography>
        <Typography component={BalanceText} variant="body2" align="center">
          {resetSent ? (
            <>
              {formatMessage(msgs.successDescription, { email })}
              <br />
              <br />
            </>
          ) : (
            formatMessage(msgs.initialDescription)
          )}
        </Typography>
        {!resetSent && (
          <form className={classes.form} noValidate onSubmit={sendLink}>
            <TextField
              required
              id="email"
              label={formatMessage(msgs.email)}
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
              size="large"
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={loading || authorizing}
            >
              {formatMessage(msgs.resetButton)}
            </Button>
          </form>
        )}
        <Grid container justify="flex-end">
          <Grid item>
            <RouterLink to="../login" variant="body2">
              {formatMessage(msgs.login_link)}
            </RouterLink>
          </Grid>
        </Grid>
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

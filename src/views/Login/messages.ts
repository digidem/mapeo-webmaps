import { defineMessages } from "react-intl";

const messages = defineMessages({
  email: {
    id: "email_label",
    defaultMessage: "Email Address",
  },
  remember: {
    id: "login_remember",
    defaultMessage: "Remember Me",
  },
  login: {
    id: "login_button",
    defaultMessage: "Login",
  },
  forgot: {
    id: "forgot_password_link",
    defaultMessage: "Forgot password?",
  },
  signup: {
    id: "signup_link",
    defaultMessage: "Don't have an account? Sign Up",
  },
  "auth/invalid-email": {
    id: "auth/invalid-email",
    defaultMessage: "Email address is invalid",
  },
  "auth/user-disabled": {
    id: "auth/user-disabled",
    defaultMessage: "User account is disabled",
  },
  "auth/user-not-found": {
    id: "auth/user-not-found",
    defaultMessage: "User account not found",
  },
  "auth/wrong-password": {
    id: "auth/wrong-password",
    defaultMessage: "Incorrect password",
  },
});

export default messages
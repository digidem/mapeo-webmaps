import { defineMessages } from "react-intl";

export const messages = defineMessages({
  email: {
    id: "email_label",
    defaultMessage: "Email Address",
  },
  signup: {
    id: "signup_button",
    defaultMessage: "Create an account",
  },
  have_account: {
    id: "have_account_link",
    defaultMessage: "Already have an account? Sign in",
  },
  "auth/email-already-in-use": {
    id: "auth/email-already-in-use",
    defaultMessage:
      "Email is already in use (you probably already have an account)",
  },
  "auth/invalid-email": {
    id: "auth/invalid-email",
    defaultMessage: "Email address is invalid",
  },
  'auth/weak-password': {
    id: 'auth/weak-password',
    defaultMessage: 'Password needs to be 8 character or longer',
  },
})

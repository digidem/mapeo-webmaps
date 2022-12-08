import { defineMessages } from "react-intl";

const messages = defineMessages({
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

export default messages
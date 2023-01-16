import { SignUpForm } from "./SignUpForm";
import AuthPanel from "../../components/AuthPanel";
import { RouteComponentProps } from "@reach/router";

export const SignupView = (props: RouteComponentProps) => {
  return (
    <AuthPanel>
      <SignUpForm />
    </AuthPanel>
  );
};

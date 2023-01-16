import { RouteComponentProps } from "@reach/router";
import { SignInForm } from "./SignInForm";
import { AuthPanel } from "../../components/AuthPanel";
// import { RouteType } from "../../types"

export const LoginView = ({}: RouteComponentProps) => (
  <AuthPanel>
    <SignInForm />
  </AuthPanel>
);

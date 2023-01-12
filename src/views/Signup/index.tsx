import { SignUpForm } from "./SignUpForm";
import AuthPanel from "../../components/AuthPanel";
import { RouteType } from "../../types";

export const SignupView = (props: RouteType) => {
  return (
    <AuthPanel>
      <SignUpForm />
    </AuthPanel>
  );
};

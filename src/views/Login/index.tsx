import { RouteComponentProps } from "@reach/router";
import { SignInForm } from "./SignInForm"
import AuthPanel from "../../components/AuthPanel"


const LoginView = ({ }: RouteComponentProps) => {
  return (
    <AuthPanel>
      <SignInForm />
    </AuthPanel>
  )
}

export default LoginView

import { SignInForm } from "./SignInForm"
import AuthPanel from "../../components/AuthPanel"

import { RouteComponentProps } from "@reach/router"


const LoginView = ({ }: RouteComponentProps) => {
  return (
    <AuthPanel>
      <SignInForm />
    </AuthPanel>
  )
}

export default LoginView
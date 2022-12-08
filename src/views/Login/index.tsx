import { SignInForm } from "./SignInForm"
import AuthPanel from "../../components/AuthPanel"
import { RouteType } from "../../types"


const LoginView = ({ }: RouteType) => {
  return (
    <AuthPanel>
      <SignInForm />
    </AuthPanel>
  )
}

export default LoginView
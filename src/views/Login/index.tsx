import { SignInForm } from "./SignInForm"
import AuthPanel from "../../components/AuthPanel"
import { RouteComponentProps } from "@reach/router"
// import { RouteType } from "../../types"


export const LoginView = ({ }: RouteComponentProps) => {
  return (
    <AuthPanel>
      <SignInForm />
    </AuthPanel>
  )
}

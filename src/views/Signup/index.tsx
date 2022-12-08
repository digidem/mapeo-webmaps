import { SignUpForm } from "./SignUpForm"
import AuthPanel from "../../components/AuthPanel"
import { RouteType } from "../../types"


const SignupView = (props: RouteType) => {
  return (
    <AuthPanel>
      <SignUpForm />
    </AuthPanel>
  )
}

export default SignupView
import { RouteComponentProps } from '@reach/router'
import { SignUpForm } from './SignUpForm'
import { AuthScreen } from '../../components/AuthScreen'

export const SignupView = ({}: RouteComponentProps) => (
  <AuthScreen>
    <SignUpForm />
  </AuthScreen>
)

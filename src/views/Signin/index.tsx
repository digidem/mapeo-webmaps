import { RouteComponentProps } from '@reach/router'
import { SignInForm } from './SignInForm'
import { AuthScreen } from '../../components/AuthScreen'

export const LoginView = ({}: RouteComponentProps) => (
  <AuthScreen>
    <SignInForm />
  </AuthScreen>
)

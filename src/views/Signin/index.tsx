import { RouteComponentProps } from '@reach/router'
import { SignInForm } from './SignInForm'
import { AuthPanel } from '../../components/AuthPanel'

export const LoginView = ({}: RouteComponentProps) => (
  <AuthPanel>
    <SignInForm />
  </AuthPanel>
)

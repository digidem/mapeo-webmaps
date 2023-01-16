import { RouteComponentProps } from '@reach/router'
import { SignUpForm } from './SignUpForm'
import { AuthPanel } from '../../components/AuthPanel'

export const SignupView = ({}: RouteComponentProps) => (
  <AuthPanel>
    <SignUpForm />
  </AuthPanel>
)

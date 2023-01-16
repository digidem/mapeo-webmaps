import { RouteComponentProps } from '@reach/router'
import { SignUpForm } from './SignUpForm'
import AuthPanel from '../../components/AuthPanel'

export const SignupView = (props: RouteComponentProps) => (
  <AuthPanel>
    <SignUpForm />
  </AuthPanel>
)

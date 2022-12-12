import { useEffect, useState } from "react"
import firebase from "firebase/app"
import { useAuthState } from "react-firebase-hooks/auth";
import { navigate, useLocation } from "@reach/router";
import { useIntl } from "react-intl"
import { Stack, Typography, Link } from '@mui/material'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { useTheme } from "@mui/material"
import { validatePassword, validateEmail, errorType } from '../../helpers/form'

import TextInput from '../../components/TextInput'
import FormButton from '../../components/FormButton'

import msgs from './messages'
import IconBadge from "../../components/IconBadge"
import { LocationProps } from "../../types";

const errorTypes = {
  "auth/email-already-in-use": "email",
  "auth/invalid-email": "email",
  "auth/weak-password": "password"
};


export const SignUpForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [user, authorizing] = useAuthState(firebase.auth())
  const location = useLocation() as unknown as LocationProps;

  const [emailError, setEmailError] = useState<errorType | null | undefined>()
  const [passwordError, setPasswordError] = useState<errorType | null | undefined>()
  const [loading, setLoading] = useState(false)

  const { formatMessage } = useIntl()
  const theme = useTheme()

  useEffect(() => {
    const from = location?.state?.from || "/"
    if (user) navigate(from, { replace: true })
  }, [user, location])


  const signup = (event: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((error: errorType) => {
        const isEmailError = error && errorTypes[error.code] === "email"
        const isPasswordError = error && errorTypes[error.code] === "password"
        if (isEmailError) {
          setEmailError(error)
          return
        }
        if (isPasswordError) {
          setPasswordError(error)
          return
        }
      })
      .finally(() => setLoading(false))
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) {
      validateEmail(email, setEmailError)
    }
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordError) {
      validatePassword(password, setPasswordError)
    }
    setPassword(event.target.value)
  }

  return (
    <Stack spacing={2} component="form" onSubmit={signup}>
      <Stack direction="row" spacing={2} alignItems="center">
        <IconBadge backgroundColor={theme.primary} icon={PersonAddAltOutlinedIcon} />
        <Typography component="h1" variant="h5">
          {formatMessage(msgs.signup)}
        </Typography>
      </Stack>

      <TextInput
        required
        type="email"
        id="email"
        label="Email address"
        name="email"
        autoComplete="email"
        autoFocus
        error={!!emailError}
        helperText={emailError && formatMessage(msgs[emailError.code])}
        value={email}
        onChange={handleEmailChange}
        onBlur={() => {
          validateEmail(email, setEmailError)
        }}
      />
      <TextInput
        required
        hiddenLabel
        type="password"
        label="Password"
        error={!!passwordError}
        helperText={passwordError && formatMessage(msgs[passwordError.code])}
        value={password}
        onBlur={() => {
          validatePassword(password, setPasswordError)
        }}
        onChange={handlePasswordChange}
      />
      <FormButton onSubmit={signup} loading={loading} disabled={!!emailError || !!passwordError || !!authorizing}>
        {formatMessage(msgs['signup'])}
      </FormButton>
      <Link
        href="/auth/login"
        variant="body1"
        fontWeight={600}
        underline={'hover'}
        color={theme.white}
      >
        {formatMessage(msgs['have_account'])}
      </Link>
    </Stack>)
}
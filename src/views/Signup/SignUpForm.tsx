import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { navigate, useLocation } from '@reach/router'
import { useIntl } from 'react-intl'
import { Stack, Typography, Link, useTheme } from '@mui/material'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { auth } from '../../index'
import { validatePassword, validateEmail, SignupErrorCodeType, SignupErrorType } from '../../helpers/form'

import TextInput from '../../components/TextInput'
import Button from '../../components/Button'

import msgs from './messages'
import IconBadge from '../../components/IconBadge'

const errorTypes = {
  'auth/email-already-in-use': 'email',
  'auth/invalid-email': 'email',
  'auth/weak-password': 'password',
}

export const SignUpForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, authorizing] = useAuthState(auth)

  const [emailError, setEmailError] = useState<SignupErrorType>()
  const [passwordError, setPasswordError] = useState<SignupErrorType>()
  const [loading, setLoading] = useState(false)

  const { formatMessage } = useIntl()
  const theme = useTheme()

  const signup = (event: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const { user } = userCredential
        console.log({ user })
        // ...
      })
      .catch((error: SignupErrorType) => {
        const isEmailError = error && errorTypes[error.code] === 'email'
        const isPasswordError = error && errorTypes[error.code] === 'password'
        if (isEmailError) {
          setEmailError(error)
          return
        }
        if (isPasswordError) {
          setPasswordError(error)
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
        label={formatMessage(msgs.email)}
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
      <Button onSubmit={signup} loading={loading} disabled={!!emailError || !!passwordError || !!authorizing}>
        {formatMessage(msgs.signup)}
      </Button>
      <Link href="/auth/login" variant="body1" fontWeight={600} underline="hover" color={theme.white}>
        {formatMessage(msgs.have_account)}
      </Link>
    </Stack>
  )
}

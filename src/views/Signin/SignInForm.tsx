import { useState } from 'react'
import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from 'firebase/auth'

import { Stack, Checkbox, FormControlLabel, Link, useTheme } from '@mui/material'
import { useIntl } from 'react-intl'
import { useAuthState } from 'react-firebase-hooks/auth'
import { FirebaseError } from 'firebase/app'
import { TextInput } from '../../components/TextInput'

import { messages as msgs } from './messages'
import { validateEmail } from '../../helpers/form'
import { auth } from '../../index'
import { Button } from '../../components/Button'

type PasswordErrorCode = 'auth/wrong-password' | 'auth/password-required'
type EmailErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/email-required'

const errorTypes = {
  'auth/invalid-email': 'email',
  'auth/user-disabled': 'email',
  'auth/user-not-found': 'email',
  'auth/email-required': 'email',
  'auth/password-required': 'password',
  'auth/wrong-password': 'password',
}

export const SignInForm = () => {
  const [remember, setRemember] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState<PasswordErrorCode | null>()
  const [emailError, setEmailError] = useState<EmailErrorCode | null>()
  const [loading, setLoading] = useState(false)
  const [, authorizing, authError] = useAuthState(auth)

  if (authError) console.error(authError)

  const { formatMessage } = useIntl()
  const theme = useTheme()

  const login = (event: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    if (!email) {
      setEmailError('auth/email-required')
      setLoading(false)
      return
    }
    if (!password) {
      setPasswordError('auth/password-required')
      setLoading(false)
      return
    }
    if (loading) return
    const persistence = remember ? browserLocalPersistence : browserSessionPersistence
    setPersistence(auth, persistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .catch(({ code: errorCode }: FirebaseError) => {
        setLoading(false)
        const isEmailError =
          errorCode &&
          Object.keys(errorTypes).includes(errorCode) &&
          errorTypes[errorCode as EmailErrorCode] === 'email'
        const isPasswordError =
          errorCode &&
          Object.keys(errorTypes).includes(errorCode) &&
          errorTypes[errorCode as PasswordErrorCode] === 'password'
        if (isEmailError) {
          setEmailError(errorCode as EmailErrorCode)
          return
        }
        if (isPasswordError) {
          setPasswordError(errorCode as PasswordErrorCode)
        }
      })
  }

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemember(event.target.checked)
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) {
      handleValidateEmail()
    }
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordError) {
      setPasswordError(null)
    }
    setPassword(event.target.value)
  }

  const handleValidateEmail = () => {
    const emailValidationCode = validateEmail(email)
    setEmailError(emailValidationCode)
  }

  return (
    <Stack spacing={2} component="form" onSubmit={login}>
      <TextInput
        required
        type="email"
        id="email"
        label="Email address"
        name="email"
        autoComplete="email"
        autoFocus
        error={!!emailError}
        helperText={emailError && formatMessage(msgs[emailError])}
        value={email}
        onChange={handleEmailChange}
        onBlur={handleValidateEmail}
      />
      <TextInput
        required
        hiddenLabel
        type="password"
        label="Password"
        error={!!passwordError}
        helperText={passwordError && formatMessage(msgs[passwordError])}
        value={password}
        onChange={handlePasswordChange}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <FormControlLabel
          control={
            <Checkbox
              value="remember"
              color="primary"
              sx={{ color: remember ? theme.primary : theme.white }}
              onChange={handleToggle}
            />
          }
          label="Remember me"
          checked={remember}
        />
        <Link
          href="/auth/reset-password"
          variant="body1"
          fontWeight={600}
          underline="hover"
          color={theme.white}
        >
          {formatMessage(msgs.forgot)}
        </Link>
      </Stack>
      <Button
        data-testid="submit-button"
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        sx={{
          borderRadius: 5,
          display: 'flex',
          justifyContent: 'space-between',
          textTransform: 'none',
        }}
        disabled={loading || authorizing}
        onSubmit={login}
        loading={loading}
      >
        {formatMessage(msgs.login)}
      </Button>
      <Link href="/auth/signup" variant="body1" fontWeight={600} underline="hover" color={theme.white}>
        {formatMessage(msgs.signup)}
      </Link>
    </Stack>
  )
}
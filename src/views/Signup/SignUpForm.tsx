import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'

import { useAuthState } from 'react-firebase-hooks/auth'
import { useIntl } from 'react-intl'
import { Stack, Typography, Link, useTheme } from '@mui/material'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined'
import { navigate } from '@reach/router'
import { auth } from '../../index'
import { validatePassword, validateEmail } from '../../helpers/form'

import { TextInput } from '../../components/TextInput'
import { Button } from '../../components/Button'

import { messages as msgs } from './messages'
import { IconBadge } from '../../components/IconBadge'

type EmailErrorCode = 'auth/email-already-in-use' | 'auth/invalid-email' | null
type PasswordErrorCode = 'auth/weak-password' | null

const errorTypes = {
  'auth/email-already-in-use': 'email',
  'auth/invalid-email': 'email',
  'auth/weak-password': 'password',
}

export const SignUpForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [, authorizing] = useAuthState(auth)

  const [emailError, setEmailError] = useState<EmailErrorCode>()
  const [passwordError, setPasswordError] = useState<PasswordErrorCode>()
  const [loading, setLoading] = useState(false)

  const { formatMessage } = useIntl()
  const theme = useTheme()

  const signup = (event: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const { user } = userCredential
        console.log({ user })
      })
      .catch((error: PasswordErrorCode | EmailErrorCode) => {
        setLoading(false)
        const isEmailError = error && Object.keys(errorTypes).includes(error) && errorTypes[error] === 'email'
        const isPasswordError =
          error && Object.keys(errorTypes).includes(error) && errorTypes[error] === 'password'
        if (isEmailError) {
          setEmailError(error as EmailErrorCode)
          return
        }
        if (isPasswordError) {
          setPasswordError(error as PasswordErrorCode)
        }
      })
      .finally(() => setLoading(false))
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (emailError) {
      handleValidateEmail()
    }
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordError) {
      handleValidatePassword()
    }
    setPassword(event.target.value)
  }

  const handleValidateEmail = () => {
    const emailValidationCode = validateEmail(email)
    setEmailError(emailValidationCode)
  }
  const handleValidatePassword = () => {
    const passwordValidationCode = validatePassword(password)
    setPasswordError(passwordValidationCode)
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
        onBlur={handleValidatePassword}
        onChange={handlePasswordChange}
      />
      <Button
        onSubmit={signup}
        loading={loading}
        disabled={!!emailError || !!passwordError || !!authorizing || loading}
      >
        {formatMessage(msgs.signup)}
      </Button>
      <Link
        href="/auth/login"
        onMouseDown={() => navigate('/auth/login')}
        variant="body1"
        fontWeight={600}
        underline="hover"
        color={theme.white}
      >
        {formatMessage(msgs.have_account)}
      </Link>
    </Stack>
  )
}

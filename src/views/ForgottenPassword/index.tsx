import { Typography, Stack, Link, useTheme, Zoom } from '@mui/material'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useIntl } from 'react-intl'
import { useState } from 'react'
import { navigate, RouteComponentProps } from '@reach/router'
import { FirebaseError } from 'firebase/app'

import { messages as msgs } from './messages'
import { IconBadge } from '../../components/IconBadge'
import { TextInput } from '../../components/TextInput'
import { AuthScreen } from '../../components/AuthScreen'
import { Button } from '../../components/Button'
import { emailRegex } from '../../helpers/regex'

type SuccessfulReset = 'success' | 'untried' | 'emailNonexistant'

export const ForgottenPasswordView = ({ }: RouteComponentProps) => {
  const { formatMessage } = useIntl()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)

  const [resetAttempt, setResetAttempt] = useState<SuccessfulReset>('untried')
  const [loading, setLoading] = useState(false)

  const theme = useTheme()
  const auth = getAuth()

  const validEmail = emailIsValid(email)

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmailValue = event.target.value
    setEmail(newEmailValue)
    // clears email error
    if (emailError && emailIsValid(newEmailValue)) {
      setEmailError(false)
    }
    // clears error message
    if (resetAttempt !== 'untried') {
      setResetAttempt('untried')
    }
  }

  const handleBlur = () => {
    if (email && !validEmail) setEmailError(true)
  }

  const sendResetPassword = (event: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => {
    event.preventDefault()
    if (!validEmail) return
    setLoading(true)

    sendPasswordResetEmail(auth, email)
      .then(() => {
        setResetAttempt('success')
      })
      .catch((err: FirebaseError) => {
        if (err.code === 'auth/user-not-found') {
          setResetAttempt('emailNonexistant')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const selectErrorMsg = (
    unsuccessfulResetAttempt: Exclude<SuccessfulReset, 'untried'>,
    attemptedEmail: string,
  ) =>
    unsuccessfulResetAttempt === 'emailNonexistant'
      ? formatMessage(msgs.email_nonexistant, { email: attemptedEmail })
      : formatMessage(msgs.successDescription, { email: attemptedEmail })

  return (
    <AuthPanel>
      <Stack spacing={8}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconBadge />
            <Typography variant="h5" component="h2">
              {formatMessage(msgs["initialTitle"])}
            </Typography>
          </Stack>
          {resetAttempt === 'untried' ? (
            <Typography variant="body1">{formatMessage(msgs.initialDescription)}</Typography>
          ) : (
            // eslint-disable-next-line
            <Zoom in={true} style={{ transitionDelay: '500ms' }}>
              <Typography variant="body1">{selectErrorMsg(resetAttempt, email)}</Typography>
            </Zoom>
          )}
        </Stack>

        <Stack spacing={2} component="form" onSubmit={sendResetPassword}>
          <TextInput
            required
            id="email"
            label="Email address"
            name="email"
            autoComplete="email"
            autoFocus
            error={!!emailError}
            helperText={emailError && formatMessage(msgs.invalid_email)}
            value={email}
            onChange={handleEmailChange}
            onBlur={handleBlur}
          />
          <Button disabled={!validEmail} loading={loading} onSubmit={sendResetPassword}>
            {formatMessage(msgs.resetButton)}
          </Button>
          <Link
            href="/auth/login"
            variant="body1"
            fontWeight={600}
            underline={"hover"}
            color={theme.white}
          >
            {formatMessage(msgs["login_link"])}
          </Link>
        </Stack>
      </Stack>
    </AuthScreen>
  )
}

function emailIsValid(email: string) {
  return email.match(emailRegex)
}

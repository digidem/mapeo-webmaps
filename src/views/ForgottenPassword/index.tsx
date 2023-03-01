import { Typography, Stack, Link, useTheme, Zoom } from '@mui/material'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useIntl } from 'react-intl'
import { useState } from 'react'
import { navigate, RouteComponentProps } from '@reach/router'

import { messages as msgs } from './messages'
import { IconBadge } from '../../components/IconBadge'
import { TextInput } from '../../components/TextInput'
import { AuthScreen } from '../../components/AuthScreen'
import { validateEmail } from '../../helpers/form'
import { Button } from '../../components/Button'

export const ForgottenPasswordView = ({}: RouteComponentProps) => {
  const { formatMessage } = useIntl()
  const [email, setEmail] = useState('')
  const [successfulReset, setSuccessfulReset] = useState(false)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const auth = getAuth()

  const validEmail = email && !validateEmail(email)

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const sendResetPassword = (event: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => {
    event.preventDefault()
    if (!validEmail) return
    setLoading(true)

    sendPasswordResetEmail(auth, email).then(() => {
      setSuccessfulReset(true)
      setLoading(false)
    })
  }

  return (
    <AuthScreen>
      <Stack spacing={8}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconBadge />
            <Typography variant="h5" component="h2">
              {formatMessage(msgs.initialTitle)}
            </Typography>
          </Stack>
          {!successfulReset ? (
            <Typography variant="body1">{formatMessage(msgs.initialDescription)}</Typography>
          ) : (
            <Zoom in={successfulReset} style={{ transitionDelay: '500ms' }}>
              <Typography variant="body1">{formatMessage(msgs.successDescription, { email })}</Typography>
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
            value={email}
            onChange={handleEmailChange}
          />
          <Button disabled={!validEmail} loading={loading} onSubmit={sendResetPassword}>
            {formatMessage(msgs.resetButton)}
          </Button>
          <Link
            // href attribute is included here to ensure this component renders a semantically correct <a> tag.
            href="/auth/login"
            // onMouseDown handles the navigation because otherwise onblur event on input will block nav.
            onMouseDown={() => navigate('/auth/login')}
            variant="body1"
            fontWeight={600}
            underline="hover"
            color={theme.white}
          >
            {formatMessage(msgs.login_link)}
          </Link>
        </Stack>
      </Stack>
    </AuthScreen>
  )
}

import { Typography, Stack, Button, Link, useTheme } from '@mui/material'
import EastIcon from '@mui/icons-material/East'

import { useIntl } from 'react-intl'
import { useState } from 'react'
import { navigate, RouteComponentProps } from '@reach/router'
import { messages as msgs } from './messages'
import { IconBadge } from '../../components/IconBadge'
import { TextInput } from '../../components/TextInput'
import { AuthScreen } from '../../components/AuthScreen'

export const ForgottenPasswordView = ({ }: RouteComponentProps) => {
  const { formatMessage } = useIntl()
  const [email, setEmail] = useState('')
  const theme = useTheme()

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
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

          <Typography variant="body1">{formatMessage(msgs.initialDescription)}</Typography>
        </Stack>

        <Stack spacing={2}>
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
          <Button
            data-testid="submit-button"
            type="submit"
            // disabled={loading || authorizing}
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: 5,
              display: 'flex',
              justifyContent: 'space-between',
              textTransform: 'none',
              fontWeight: 600,
            }}
            endIcon={<EastIcon />}
          >
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

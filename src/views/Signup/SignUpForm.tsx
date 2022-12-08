import { useState } from "react"
import { Button, Stack, Checkbox, FormControlLabel, Typography, Link, FormLabel } from '@mui/material'
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import TextInput from '../../components/TextInput'
import FormButton from '../../components/FormButton'

import msgs from './messages'
import IconBadge from "../../components/IconBadge"

export const SignUpForm = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)

  const { formatMessage } = useIntl()
  const theme = useTheme()

  const signup = () => { console.log('do a signup') }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        // error={!!isEmailError}
        // helperText={isEmailError && formatMessage(msgs[error.code])}
        value={email}
        onChange={handleEmailChange}
      />
      <TextInput
        required
        hiddenLabel
        type="password"
        label="Password"
        // error={!!isPasswordError}
        // helperText={isPasswordError && formatMessage(msgs[error.code])}
        value={password}
        onChange={handlePasswordChange}
      />
      <FormButton onSubmit={signup}>
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
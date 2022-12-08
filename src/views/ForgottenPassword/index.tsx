import AuthPanel from "../../components/AuthPanel"
import { RouteType } from "../../types"
import { Typography, Box, Stack, Button, Link, useTheme } from "@mui/material"
import EastIcon from '@mui/icons-material/East'

import msgs from './messages'
import { useIntl } from "react-intl";
import IconBadge from "../../components/IconBadge";
import { useState } from "react";
import TextInput from "../../components/TextInput";


const ForgottenPasswordView = ({ }: RouteType) => {
  const { formatMessage } = useIntl()
  const [email, setEmail] = useState('')
  const theme = useTheme()

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  return (
    <AuthPanel>
      <Stack spacing={8}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconBadge />
            <Typography variant="h5" component="h2">{formatMessage(msgs['initialTitle'])}</Typography>
          </Stack>

          <Typography variant="body1">{formatMessage(msgs['initialDescription'])}</Typography>
        </Stack>

        <Stack spacing={2}>
          <TextInput
            required
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
          <Button
            data-testid="submit-button"
            type="submit"

            // disabled={loading || authorizing}
            fullWidth
            size="large"
            variant="contained"
            color="primary"
            sx={{ borderRadius: 5, display: 'flex', justifyContent: 'space-between', textTransform: 'none', fontWeight: 600 }}
            endIcon={<EastIcon />}
          >
            {formatMessage(msgs['resetButton'])}
          </Button>
          <Link
            href="/auth/login"
            variant="body1"
            fontWeight={600}
            underline={'hover'}
            color={theme.white}
          >
            {formatMessage(msgs['login_link'])}
          </Link>
        </Stack>
      </Stack>
    </AuthPanel>
  )
}

export default ForgottenPasswordView
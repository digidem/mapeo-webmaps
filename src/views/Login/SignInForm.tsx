import { useEffect, useState } from "react"
import { auth, firebaseApp } from "../../index"
import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword, browserSessionPersistence } from "firebase/auth"

import { Button, Stack, Checkbox, FormControlLabel, Typography, Link, FormLabel } from '@mui/material'
import EastIcon from '@mui/icons-material/East'
import { useTheme } from "@mui/material"
import { useIntl } from "react-intl"
import TextInput from '../../components/TextInput'

import msgs from './messages'
import { SigninErrorType, validateEmail } from "../../helpers/form";
import { useAuthState } from "react-firebase-hooks/auth"

const errorTypes = {
  "auth/invalid-email": "email",
  "auth/user-disabled": "email",
  "auth/user-not-found": "email",
  "auth/wrong-password": "password",
};

export const SignInForm = () => {
  const [remember, setRemember] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState<SigninErrorType | null>()
  const [emailError, setEmailError] = useState<SigninErrorType>()
  const [loading, setLoading] = useState(false)
  const [, authorizing, authError] = useAuthState(auth);

  if (authError) console.error(authError);

  const { formatMessage } = useIntl()
  const theme = useTheme()

  const login = (event: React.FormEvent<HTMLButtonElement | HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    const persistence = remember ? browserLocalPersistence : browserSessionPersistence
    setPersistence(auth, persistence)
      .then(() => signInWithEmailAndPassword(auth, email, password))
      .catch((error: SigninErrorType) => {
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
      });
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemember(event.target.checked)
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (passwordError) {
      setPasswordError(null)
    }
    setPassword(event.target.value)
  }

  useEffect(() => {
    if (passwordError) {
      console.log({ passwordError })
    }
  }, [passwordError])

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
        onChange={handlePasswordChange}
      />
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <FormControlLabel
          control={<Checkbox value="remember" color="primary" sx={{ color: remember ? theme.primary : theme.white }} onChange={handleToggle} />}
          label={'Remember me'}
          checked={remember}
        />
        <Link
          href="/auth/reset-password"
          variant="body1"
          fontWeight={600}
          underline={'hover'}
          color={theme.white}
        >
          {formatMessage(msgs['forgot'])}
        </Link>
      </Stack>
      <Button
        data-testid="submit-button"
        type="submit"
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        sx={{ borderRadius: 5, display: 'flex', justifyContent: 'space-between', textTransform: 'none' }}
        endIcon={<EastIcon />}
        disabled={loading || authorizing}
        onSubmit={login}
      >
        {formatMessage(msgs['login'])}
      </Button>
      <Link
        href="/auth/signup"
        variant="body1"
        fontWeight={600}
        underline={'hover'}
        color={theme.white}
      >
        {formatMessage(msgs['signup'])}
      </Link>
    </Stack>)
}
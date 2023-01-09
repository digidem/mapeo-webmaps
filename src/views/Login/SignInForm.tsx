import { useState } from "react";
import {
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  Typography,
  Link,
  FormLabel,
} from "@mui/material";
import { East as EastIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material";
import { useIntl } from "react-intl";
import TextInput from "../../components/TextInput";

import msgs from "./messages";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const { formatMessage } = useIntl();
  const theme = useTheme();

  const login = () => {
    console.log("do a login");
  };

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemember(event.target.checked);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

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
          label={"Remember me"}
          checked={remember}
        />
        <Link
          href="/auth/reset-password"
          variant="body1"
          fontWeight={600}
          underline={"hover"}
          color={"white"}
        >
          {formatMessage(msgs["forgot"])}
        </Link>
      </Stack>
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
          display: "flex",
          justifyContent: "space-between",
          textTransform: "none",
        }}
        endIcon={<EastIcon />}
      >
        {formatMessage(msgs["login"])}
      </Button>
      <Link
        href="/auth/signup"
        variant="body1"
        fontWeight={600}
        underline={"hover"}
        color={"white"}
      >
        {formatMessage(msgs["signup"])}
      </Link>
    </Stack>
  );
};

import React, { useState, useCallback } from "react";
import MuiTextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

export const TextField = React.memo(({ onValueChange, ...props }) => (
  <MuiTextField
    variant="outlined"
    margin="normal"
    fullWidth
    onChange={e => onValueChange(e.target.value)}
    {...props}
  />
));

export const PasswordField = React.memo(props => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(current => !current);
  }, []);

  const handleMouseDownPassword = useCallback(event => {
    event.preventDefault();
  }, []);

  return (
    <TextField
      name="password"
      label="Password"
      type={showPassword ? "text" : "password"}
      id="password"
      autoComplete="current-password"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              edge="end"
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        )
      }}
      {...props}
    />
  );
});

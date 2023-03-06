import { ComponentType, useRef } from 'react'
import { FormLabel, Stack, useTheme, TextFieldProps } from '@mui/material'
import { StyledTextField } from './styles'

type TextInputType = TextFieldProps & {
  label: string
  required?: boolean
  type?: React.HTMLInputTypeAttribute
  renderHelperText?: ComponentType
}

export const TextInput = ({
  label,
  required,
  type,
  variant = 'filled',
  renderHelperText: HelperText,
  ...rest
}: TextInputType) => {
  const theme = useTheme()

  const inputSx = {
    backgroundColor: theme.white,
    borderRadius: '5px',
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <Stack spacing={1} onClick={focusInput}>
      <FormLabel sx={{ color: 'inherit' }}>
        {label}
        {required && ' *'}
      </FormLabel>
      <StyledTextField
        inputRef={inputRef}
        type={type || 'text'}
        hiddenLabel
        variant={variant}
        size="small"
        sx={inputSx}
        {...rest}
      />
      {HelperText ? <HelperText /> : null}
    </Stack>
  )
}

import { useRef } from 'react'
import { BaseTextFieldProps, FormLabel, Stack, useTheme, TextFieldProps, TextField } from '@mui/material'
import { StyledTextField } from './styles'

type TextInputType = TextFieldProps & {
  label: string
  required: boolean
  type?: React.HTMLInputTypeAttribute
}

const TextInput = ({ label, required, type, ...rest }: TextInputType) => {
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
        variant="filled"
        size="small"
        sx={inputSx}
        {...rest}
      />
    </Stack>
  )
}

export default TextInput

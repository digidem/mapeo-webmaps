import { styled, Button } from '@mui/material'

export const StyledButton = styled(Button)`
  &.Mui-disabled {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.white};
    opacity: 0.7;
  }
`

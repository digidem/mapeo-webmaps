import styled from '@emotion/styled'
import Select from '@mui/material/Select'

export const StyledSelect = styled(Select)`
  border: none;

  & > div {
    padding-right: 0 !important;
  }

  & svg {
    transform: none;
  }

  &::after,
  &::before {
    border-bottom: none !important;
  }
`

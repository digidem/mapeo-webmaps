import { css, styled } from '@mui/material'

export const IFrame = styled('iframe')`
  width: 100%;
  height: calc(100vh - 80px);
  border: none;
  ${(props) =>
    props.hidden
      ? css`
          visibility: hidden;
        `
      : ''}
`

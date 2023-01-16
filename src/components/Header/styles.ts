import { css, styled } from '@mui/material'

export const HeaderWrapper = styled('header')`
  width: 100%;
  height: 80px;
  /* padding: 18px; */
  background-color: ${({ theme }) => theme.blueDark};
`

export const LogoImg = styled('img')`
  width: 300px;
  height: auto;
`

export const LogOutButton = styled('button')`
  all: unset;
  min-width: 80px;
  border-left: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  height: 100%;
  background-color: ${({ theme }) => theme.blueDark};
  height: 80px;
  padding: 0 10px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`

export const Block = styled('div')`
  flex: 1;
  ${({ centered }: { centered?: boolean }) =>
    centered
      ? css`
          display: flex;
          justify-content: center;
        `
      : ''}
`

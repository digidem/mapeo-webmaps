import { styled } from '@mui/system'

export const Img = styled('img')`
  width: 350px;
  height: 350px;
`

export const Overlay = styled('div')`
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 1000;
  background-color: #000000cc;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    max-width: 800px;
  }
`

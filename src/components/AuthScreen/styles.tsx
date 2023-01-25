import styled from '@emotion/styled'
import { Stack } from '@mui/material'

export const Image = styled.img`
  height: 150px;
  width: auto;
`

export const Column = styled.div`
  margin-top: 10vh;
`

export const IluContainer = styled.div`
  position: relative;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const SvgImg = styled.img`
  position: absolute;
`

export const SvgImg1 = styled(SvgImg)`
  top: -5%;
  right: -5%;
  height: 30%;
`
export const SvgImg2 = styled.img`
  width: 100%;
  height: 100%;
`
export const SvgImg3 = styled(SvgImg)`
  bottom: -5%;
  left: -10%;
  width: 25%;
  height: 25%;
`

export const CenteredStack = ({ ...rest }) => (
  <Stack direction="column" justifyContent="center" alignItems="center" spacing={3} {...rest} />
)

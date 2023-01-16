import { Zoom } from '@mui/material'
import { IluContainer, SvgImg1, SvgImg2, SvgImg3 } from './styles'

const Illustration = () => (
  <IluContainer>
    <Zoom in timeout={700} style={{ transitionDelay: '400ms', zIndex: 2 }}>
      <SvgImg1 src="/svg/auth1.svg" />
    </Zoom>
    <Zoom in timeout={700} style={{ transitionDelay: '200ms', zIndex: 1 }}>
      <SvgImg2 src="/svg/auth2.svg" />
    </Zoom>
    <Zoom in timeout={700} style={{ transitionDelay: '500ms', zIndex: 2 }}>
      <SvgImg3 src="/svg/auth3.svg" />
    </Zoom>
  </IluContainer>
)

export default Illustration

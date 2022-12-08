import { Container, Link, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import SplitLayout from "../../layouts/split"
import { ChildType } from "../../types"
import Illustration from "./Illustration"
import { CenteredStack as Centered, Column, Image } from "./styles"

const LeftColumn = Column
const RightColumn = Column

type AuthPanelProps = {
  children: ChildType // Should have a single child component
}

const AuthPanel = ({ children }: AuthPanelProps) => {
  return (
    <SplitLayout>
      <LeftColumn>
        <Container maxWidth="xs">
          <Centered sx={{
            marginBottom: 5
          }}>
            <Image src={'/svg/logo.svg'} alt="" />
            <Typography component="h1" variant="h4" align="center">
              Webmaps
            </Typography>
          </Centered>
          {children}
        </Container>
      </LeftColumn>

      <RightColumn>
        <Container maxWidth="md" sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          height: '70vh',
        }}>
          <Illustration />
          <Stack sx={{
            width: '60%',
            position: 'relative',
            top: '-2%',
            left: '5%',
          }}
            spacing={1}>
            <Typography variant="h3" component="h2">
              Share your Mapeo maps publicly
            </Typography>
            <Typography variant="h6" component="p" sx={{
            }}>
              Learn more about <Link href="https://docs.mapeo.app/" fontWeight={600} underline="hover">Webmaps and Mapeo</Link>
            </Typography>
          </Stack>
        </Container>
      </RightColumn>
    </SplitLayout >
  )
}

export default AuthPanel
import { Container, Link, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { navigate, useLocation } from '@reach/router'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../../index'
import { SplitLayout } from '../../layouts/split'
import { LocationProps } from '../../types'
import { Illustration } from './Illustration'
import { CenteredStack as Centered, Column, Image } from './styles'

const LeftColumn = Column
const RightColumn = Column

type AuthPanelProps = {
  children: React.ReactNode // Should have a single child component
}

export const AuthPanel = ({ children }: AuthPanelProps) => {
  const [user] = useAuthState(auth)
  const location = useLocation() as LocationProps

  useEffect(() => {
    const from = location?.state?.from || '/'
    if (user) navigate(from, { replace: true })
  }, [user, location])

  return (
    <SplitLayout>
      <LeftColumn>
        <Container maxWidth="xs">
          <Centered
            sx={{
              marginBottom: 5,
            }}
          >
            <Image src="/svg/logo.svg" alt="" />
            <Typography component="h1" variant="h4" align="center">
              Webmaps
            </Typography>
          </Centered>
          {children}
        </Container>
      </LeftColumn>

      <RightColumn>
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            height: '70vh',
          }}
        >
          <Illustration />
          <Stack
            sx={{
              width: '60%',
              position: 'relative',
              top: '-2%',
              left: '5%',
            }}
            spacing={1}
          >
            <Typography variant="h3" component="h2">
              Share your Mapeo maps publicly
            </Typography>
            <Typography variant="h6" component="p" sx={{}}>
              Learn more about{' '}
              <Link href="https://docs.mapeo.app/" fontWeight={600} underline="hover">
                Webmaps and Mapeo
              </Link>
            </Typography>
          </Stack>
        </Container>
      </RightColumn>
    </SplitLayout>
  )
}

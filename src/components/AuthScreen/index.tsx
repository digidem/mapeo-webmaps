import { Box, Container, Grid, Link, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { navigate, useLocation } from '@reach/router'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useIntl } from 'react-intl'
import { auth } from '../../index'
import { LocationProps } from '../../types'
import { Illustration } from './Illustration'
import { messages as msgs } from './messages'
import { CenteredStack as Centered, Column, Image } from './styles'

const LeftColumn = Column
const RightColumn = Column
const GRID_LAYOUT = [4, 8]

export const AuthScreen = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme()
  const { formatMessage } = useIntl()
  const [user] = useAuthState(auth)
  const location = useLocation() as LocationProps

  useEffect(() => {
    const from = location?.state?.from || '/'
    if (user) navigate(from, { replace: true })
  }, [user, location])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background',
      }}
    >
      <Grid container columns={12}>
        <Grid
          xs={GRID_LAYOUT[0]}
          bgcolor={theme.blueDark}
          color={theme.white}
          sx={{
            minHeight: '100vh',
            overflow: 'hidden',
          }}
        >
          <LeftColumn>
            <Container maxWidth="xs">
              <Centered
                sx={{
                  marginBottom: 5,
                }}
              >
                <Image src="/svg/logo.svg" alt="" />
                <Typography component="h1" variant="h4" align="center">
                  {formatMessage(msgs.app_title)}
                </Typography>
              </Centered>
              {children}
            </Container>
          </LeftColumn>
        </Grid>
        <Grid
          xs={GRID_LAYOUT[1]}
          bgcolor={theme.background}
          color={theme.black}
          sx={{
            minHeight: '100vh',
            overflow: 'hidden',
          }}
        >
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
                  {formatMessage(msgs.auth_title)}
                </Typography>
                <Typography variant="h6" component="p" sx={{}}>
                  {formatMessage(msgs.learn_more_title)}
                  <Link href={formatMessage(msgs.learn_more_href)} fontWeight={600} underline="hover">
                    {formatMessage(msgs.learn_more_link)}
                  </Link>
                </Typography>
              </Stack>
            </Container>
          </RightColumn>
        </Grid>
      </Grid>
    </Box>
  )
}

import { Box, Link, Stack, Typography, useTheme } from '@mui/material'
import {
  Link as ReachLink,
  RouteComponentProps,
  useParams,
  useLocation,
  WindowLocation,
  navigate,
} from '@reach/router'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { useAuthState } from 'react-firebase-hooks/auth'
import { StackProps } from '@mui/system'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'
import CreateIcon from '@mui/icons-material/Create'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import { useIntl } from 'react-intl'

import { auth } from '../..'
import { Button } from '../../components/Button'
import { AuthorisedLayout } from '../../layouts/Authorised'
import { LogoImg } from '../../components/Header/styles'
import { msgs } from './messages'
import { IFrame } from './styles'

const SHARE_URL_BASE = 'https://maps-public.mapeo.world/groups'

const Row = ({ children, ...rest }: StackProps) => (
  <Stack direction="row" {...rest}>
    {children}
  </Stack>
)

const Header = ({}) => {
  const location = useLocation() as LocationState
  const { formatMessage } = useIntl()
  const theme = useTheme()

  const fromHome = location?.state?.fromHome

  const handleGoBack = () => {
    if (fromHome && typeof window?.history?.back === 'function') {
      window.history.back()
    } else {
      navigate('/')
    }
  }
  return (
    <Grid container columns={12} height="100%">
      <Grid xs={3} color="white" padding={2} borderRight="1px solid white" height="100%">
        <Row justifyContent="space-between">
          <Box sx={{ flex: 3 }} display="flex" alignContent="center">
            <Link
              onClick={handleGoBack}
              underline="none"
              sx={{
                color: 'white',
                cursor: 'pointer',
                transition: '0.3s opacity ease-in-out',
                '&:hover': {
                  opacity: 0.7,
                },
              }}
              display="flex"
            >
              <Row alignItems="center" display="flex">
                <ArrowBackIosNewRoundedIcon sx={{ color: 'white', marginRight: 1 }} />
                <Typography
                  variant="h6"
                  component="label"
                  fontWeight="bold"
                  sx={{ color: 'white', cursor: 'pointer' }}
                >
                  {formatMessage(msgs.goBack)}
                </Typography>
              </Row>
            </Link>
          </Box>

          <Box>
            <Button
              fullWidth={false}
              icon={CreateIcon}
              iconPosition="start"
              sx={{
                backgroundColor: 'white',
                color: 'black',
                flex: 1,
                marginRight: 2,
                borderRadius: 1,
                display: 'inline-flex',
                '&:hover': {
                  backgroundColor: theme.primary,
                  color: 'white',
                },
              }}
              onClick={() => null}
            >
              {formatMessage(msgs.edit)}
            </Button>
            <Button
              fullWidth={false}
              icon={ShareOutlinedIcon}
              iconPosition="start"
              sx={{ color: 'white', flex: 1, textTransform: 'none', borderRadius: 1, display: 'inline-flex' }}
              onClick={() => null}
            >
              {formatMessage(msgs.share)}
            </Button>
          </Box>
        </Row>
      </Grid>
      <Grid xs={9} padding={2} height="100%">
        <Row justifyContent="flex-end">
          <ReachLink to="/">
            <LogoImg src="/svg/logo-w.svg" alt="" />
          </ReachLink>
        </Row>
      </Grid>
    </Grid>
  )
}

export const MapView = ({}: RouteComponentProps) => {
  const [user] = useAuthState(auth)
  const params = useParams()

  const id = params.id as string

  const iframeSrc = user && id ? `${SHARE_URL_BASE}/${user.uid}/maps/${id}` : ''

  return (
    <AuthorisedLayout renderHeader={Header}>
      <IFrame src={iframeSrc} title={`User map: ${id}`} />
    </AuthorisedLayout>
  )
}

type LocationState = WindowLocation & {
  state: { fromHome: boolean }
}

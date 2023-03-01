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
import { Header } from './Header'
import { IFrame } from './styles'

const SHARE_URL_BASE = 'https://maps-public.mapeo.world/groups'

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

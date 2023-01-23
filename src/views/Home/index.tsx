import { Box, Link, Typography } from '@mui/material'
import { Stack } from '@mui/system'

import { useIntl } from 'react-intl'
import { AddMapButton } from '../../components/AddMapButton'
import { AuthorisedLayout } from '../../layouts/Authorised'
import { Img } from './styles'
import { messages as msgs } from './messages'

const NoMaps = () => {
  const { formatMessage } = useIntl()

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      sx={{ width: '100%', height: 'calc(100vh - 80px)', paddingTop: '15vh' }}
    >
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={5}>
        <Img src="/svg/nomap.svg" alt="" />
        <Typography variant="h3">{formatMessage(msgs.empty_title)}</Typography>
        <Typography variant="body1">
          {formatMessage(msgs.empty_message)}
          <Link href={formatMessage(msgs.empty_message_href)}>{formatMessage(msgs.empty_message_link)}</Link>
        </Typography>
        <AddMapButton />
      </Stack>
    </Box>
  )
}

const NoMaps = () => {
  const { formatMessage } = useIntl()

  return (
    <Box
      justifyContent="center"
      alignItems="center"
      sx={{ width: '100%', height: 'calc(100vh - 80px)', paddingTop: '15vh' }}
    >
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={5}>
        <Img src="/svg/nomap.svg" alt="" />
        <Typography variant="h3">{formatMessage(msgs.empty_title)}</Typography>
        <Typography variant="body1">
          {formatMessage(msgs.empty_message)}
          <Link href={formatMessage(msgs.empty_message_href)}>{formatMessage(msgs.empty_message_link)}</Link>
        </Typography>
        <AddMapButton />
      </Stack>
    </Box>
  )
}

export const HomeView = () => (
  <AuthorisedLayout>
    <NoMaps />
  </AuthorisedLayout>
)

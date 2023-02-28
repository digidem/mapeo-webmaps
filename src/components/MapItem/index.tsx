import { Box, Card, CardContent, CircularProgress, Link, Stack, Typography } from '@mui/material'
import { collection, Timestamp } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore'
import { useIntl } from 'react-intl'
import { auth, db } from '../..'
import { msgs } from './messages'

type DateFormatOptionsType = Intl.DateTimeFormatOptions & {
  dateStyle: 'medium'
}

const SHARE_URL_BASE = 'https://maps-public.mapeo.world/groups'

export const MapItem = ({ id, title, description, createdAt }: MapItemProps) => {
  const [user] = useAuthState(auth)
  const observationsRef = user ? collection(db, `groups/${user.uid}/maps/${id}/observations`) : null
  const [observations = [], observationsLoading] = useCollectionData(observationsRef)
  const { formatMessage } = useIntl()

  if (!user) return null
  const dateFormatOptions = { dateStyle: 'medium' } as DateFormatOptionsType

  const shareUrl = `${SHARE_URL_BASE}/${user?.uid}/maps/${id}`

  const dateTimeFormat = new Intl.DateTimeFormat('en-us', dateFormatOptions)

  return (
    <Card sx={{ width: '100%' }}>
      <CardContent>
        <Stack>
          <Box mb={6}>
            <Typography variant="h5">{title}</Typography>
            <Typography variant="caption">
              {observationsLoading ? (
                <MiniLoader />
              ) : (
                `${observations.length} ${formatMessage(msgs.observations)}`
              )}
            </Typography>
            {description ? <Typography variant="body1">{description}</Typography> : null}
          </Box>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
            <Typography variant="caption">
              {formatMessage(msgs.createdAtPrefix)} {createdAt ? dateTimeFormat.format(createdAt.toDate()) : <MiniLoader />}
            </Typography>
            <Link underline="hover" fontWeight="bold" href={shareUrl}>
              {formatMessage(msgs.publicLink)}
            </Link>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}

const MiniLoader = () => (
  <Box component="span" sx={{ display: 'inline-block', mx: '2px' }}>
    <CircularProgress color="inherit" size={10} />
  </Box>
)

type MapItemProps = {
  id: string | number
  title: string
  description?: string
  createdAt?: Timestamp
}

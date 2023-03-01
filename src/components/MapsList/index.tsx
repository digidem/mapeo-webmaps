import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { collection, DocumentData, orderBy, query } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Link, Typography, Stack } from '@mui/material'
import { MapItem } from '../MapItem'
import { Loader } from '../Loader'
import { SortToggle, SortDirectionType, SortType } from '../SortToggle'
import { auth, db } from '../..'
import { Container } from '../Container'
import { Img } from './styles'
import { messages as msgs } from './messages'
import { AddMapButton } from '../AddMapButton'

export const MapsList = ({ openDialog, isDragActive }: DragZoneProps) => {
  const [user] = useAuthState(auth)
  const [sort, setSort] = useState<SortType>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirectionType>('asc')

  const mapsRef = collection(db, `groups/${user?.uid || ''}/maps`)

  const [mapsCollection = { docs: [] }, mapsLoading] = useCollection(
    query(mapsRef, orderBy(sort, sortDirection)),
  )
  const maps = useMemo(() => mapsCollection?.docs.map((map) => ({ ...map?.data(), id: map?.id })), [
    mapsCollection,
  ]) as DocumentData[]

  const handleSortChange = (selectValue: SortType) => {
    if (selectValue === sort) {
      setSortDirection((prevSort) => (prevSort === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(selectValue)
    }
  }

  if (mapsLoading) return <Loader width={100} />

  return maps.length ? (
    <Container alignItems="flex-end">
      <SortToggle value={sort} onChange={handleSortChange} direction={sortDirection} />
      <Stack spacing={3} alignItems="flex-end" mt={0} width="100%" mb={6}>
        {maps.map((map) => (
          <MapItem
            title={map.title}
            description={map.description}
            createdAt={map.createdAt}
            id={map.id}
            key={map.id}
          />
        ))}
      </Stack>
    </Container>
  ) : (
    <NoMaps openDialog={openDialog} isDragActive={isDragActive} />
  )
}

const NoMaps = ({ openDialog, isDragActive }: DragZoneProps) => {
  const { formatMessage } = useIntl()
  return (
    <Container isDragActive={isDragActive} spacing={5}>
      <Img src="/svg/nomap.svg" alt="" />
      <Typography variant="h3">{formatMessage(msgs.empty_title)}</Typography>
      <Typography variant="body1" align="center">
        {formatMessage(msgs.empty_message)}
        <Link display="block" href={formatMessage(msgs.empty_message_href)}>
          {formatMessage(msgs.empty_message_link)}
        </Link>
      </Typography>
      <AddMapButton onClick={openDialog} />
    </Container>
  )
}

// type MapsListProps = {
//   maps: DocumentData[]
//   progress: {
//     id?: number
//     loading?: boolean
//   }
// }

type DragZoneProps = {
  openDialog: () => void
  isDragActive: boolean
}

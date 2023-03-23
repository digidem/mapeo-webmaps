import { useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import { collection, DocumentData, Timestamp } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { Link, Typography, Stack, Grow } from '@mui/material'
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

  const mapsRef = user ? collection(db, `groups/${user?.uid || ''}/maps`) : null

  const [mapsCollection = { docs: [] }, mapsLoading] = useCollection(mapsRef)
  const maps = useMemo(() => mapsCollection?.docs.map((map) => ({ ...map?.data(), id: map?.id })), [
    mapsCollection,
  ]) as MapDocument[]

  const handleSortChange = (selectValue: SortType) => {
    if (selectValue === sort) {
      setSortDirection((prevSort) => (prevSort === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(selectValue)
    }
  }

  const sortedMaps = useMemo(
    () => (sort === 'createdAt' ? sortByDate(maps, sortDirection) : sortByTitle(maps, sortDirection)),
    [maps, sort, sortDirection],
  )

  if (mapsLoading) return <Loader width={100} />

  return sortedMaps.length ? (
    <Container alignItems="flex-end" paddingTop="10vh">
      <SortToggle value={sort} onChange={handleSortChange} direction={sortDirection} />
      <Stack spacing={3} alignItems="flex-end" mt={0} width="100%" mb={6}>
        {sortedMaps.map((map, index) => (
          <Grow in timeout={index * 600} key={map.id}>
            <span style={{ width: '100%' }}>
              <MapItem
                title={map.title}
                description={map.description}
                createdAt={map.createdAt}
                id={map.id}
                key={map.id}
              />
            </span>
          </Grow>
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

const sortByDate = (data: MapDocument[], order: SortDirectionType) =>
  data.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0
    const aDate = a.createdAt.toMillis()
    const bDate = b.createdAt.toMillis()

    if (order === 'asc') {
      return aDate - bDate
    }

    return bDate - aDate
  })

const sortByTitle = (data: MapDocument[], order: SortDirectionType) =>
  data.sort((a, b) => {
    const titleA = a.title.toLowerCase()
    const titleB = b.title.toLowerCase()

    if (order === 'asc') {
      if (titleA < titleB) return -1
      if (titleA > titleB) return 1
      return 0
    }
    if (titleA < titleB) return 1
    if (titleA > titleB) return -1
    return 0
  })

type MapDocument = DocumentData & {
  title: string
  description?: string
  terms?: string
  createdAt?: Timestamp
  id: string
  public: boolean
}

type DragZoneProps = {
  openDialog: () => void
  isDragActive: boolean
}

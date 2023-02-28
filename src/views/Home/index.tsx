import { Box, Fade, Link, SelectChangeEvent, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useIntl } from 'react-intl'
import { DropzoneInputProps, useDropzone } from 'react-dropzone'
import { useCallback, useMemo, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { collection, orderBy, query } from 'firebase/firestore'
import { useCollection } from 'react-firebase-hooks/firestore'

import { Img, Overlay } from './styles'
import { messages as msgs } from './messages'
import { AddMapButton } from '../../components/AddMapButton'
import { Loader } from '../../components/Loader'
import { Button } from '../../components/Button'
import { MapsList } from '../../components/MapsList'
import { AuthorisedLayout } from '../../layouts/Authorised'
import { ProgressType, useCreateMap } from '../../hooks/useCreateMap'
import { auth, db } from '../..'
import { SortToggle, SortDirectionType, SortType } from '../../components/SortToggle'

export const HomeView = () => {
  const [user] = useAuthState(auth)
  const theme = useTheme()
  const [sort, setSort] = useState<SortType>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirectionType>('asc')

  const mapsRef = collection(db, `groups/${user?.uid || ''}/maps`)

  const [mapsCollection = { docs: [] }, mapsLoading] = useCollection(query(mapsRef, orderBy(sort, 'desc')))
  const maps = mapsCollection?.docs.map((map) => ({ ...map?.data(), id: map?.id }))

  const {
    createMap,
    progress: { loading: uploading, failedFiles },
    progress,
  } = useCreateMap()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length || !acceptedFiles[0].name.match(/.mapeomap$/)) return
      createMap(acceptedFiles)
    },
    [createMap],
  )

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: ['.mapeomap'],
    onDrop,
  })

  const handleSortChange = (selectEvent: SelectChangeEvent<unknown>) => {
    const value = selectEvent.target.value as SortType

    if (value === sort) {
      setSortDirection((prevSort) => (prevSort === 'asc' ? 'desc' : 'asc'))
    } else {
      setSort(value)
    }
  }

  if (mapsLoading)
    return (
      <AuthorisedLayout onClickAddMap={open}>
        <Loader />
      </AuthorisedLayout>
    )

  return (
    <AuthorisedLayout onClickAddMap={open}>
      <Stack
        sx={{
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            width: '10px' /* width of the entire scrollbar */,
          },
          '&::-webkit-scrollbar-track': {
            background: theme.background /* color of the tracking area */,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.blueDark /* color of the scroll thumb */,
            borderRadius: 0 /* roundness of the scroll thumb */,
          },
        }}
      >
        <input {...getInputProps()} />
        {uploading || failedFiles?.length ? (
          <Uploading progress={progress} />
        ) : (
          <div {...getRootProps({ className: 'dropzone' })}>
            <DragDropOverlay active={isDragActive} />
            {maps.length ? (
              <Container alignItems="flex-end">
                <SortToggle value={sort} onChange={handleSortChange} direction={sortDirection} />
                <MapsList maps={maps} progress={{ id: 1, loading: uploading }} />
              </Container>
            ) : (
              <NoMaps openDialog={open} isDragActive={isDragActive} />
            )}
          </div>
        )}
      </Stack>
    </AuthorisedLayout>
  )
}

type NoMapsType = {
  openDialog: () => void
  isDragActive: boolean
}

const DragDropOverlay = ({ active }: { active: boolean }) => {
  const { formatMessage } = useIntl()
  return (
    <Fade in={active}>
      <Overlay>
        <span>
          <Typography variant="h2" align="center" color="white">
            {formatMessage(msgs.drop_file_message)}
          </Typography>
        </span>
      </Overlay>
    </Fade>
  )
}

const Container = ({
  children,
  isDragActive,
  alignItems = 'center',
  spacing = 0,
}: {
  children: React.ReactNode
  isDragActive?: boolean
  alignItems?: React.CSSProperties['alignItems']
  spacing?: number
}) => (
  <Box
    justifyContent="center"
    alignItems="flex-start"
    sx={{
      width: '100%',
      height: 'calc(100vh - 80px)',
      paddingTop: '15vh',
      opacity: isDragActive ? 0.5 : 1,
      display: 'flex',
    }}
  >
    <Stack
      direction="column"
      justifyContent="center"
      alignItems={alignItems}
      maxWidth={750}
      width="100%"
      spacing={spacing}
    >
      {children}
    </Stack>
  </Box>
)

const NoMaps = ({ openDialog, isDragActive }: NoMapsType) => {
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

type UploadingType = {
  progress: ProgressType
}

const Uploading = ({
  progress: { completed, loading, error, currentFile, failedFiles, retryFailedFiles },
}: UploadingType) =>
  failedFiles?.length && !loading ? (
    <>
      <Button onClick={retryFailedFiles}>Retry</Button>
      {failedFiles.length ? (
        <Typography variant="body1">
          Failed files:{' '}
          {failedFiles.map((failed) => (
            <span>{failed}</span>
          ))}
        </Typography>
      ) : null}
    </>
  ) : (
    <>
      <Loader width={100} value={completed} />
      <Container>
        <Typography variant="body1">completed: {completed}</Typography>
        <Typography variant="body1">currentFile: {currentFile}</Typography>
        {failedFiles.length ? (
          <Typography variant="body1">
            failedFiles:{' '}
            {failedFiles.map((failed) => (
              <span>{failed}</span>
            ))}
          </Typography>
        ) : null}
      </Container>
    </>
  )

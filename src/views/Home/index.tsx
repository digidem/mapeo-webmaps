import { Fade, useTheme, Box, Link, Typography } from '@mui/material'
import { Stack } from '@mui/system'

import { useIntl } from 'react-intl'
import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'

import { Overlay } from './styles'
import { messages as msgs } from './messages'

import { Loader } from '../../components/Loader'
import { Button } from '../../components/Button'
import { MapsList } from '../../components/MapsList'
import { AuthorisedLayout } from '../../layouts/Authorised'
import { ProgressType, useCreateMap } from '../../hooks/useCreateMap'
import { Container } from '../../components/Container'

export const HomeView = () => {
  const theme = useTheme()

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
            <MapsList openDialog={open} isDragActive={isDragActive} />
          </div>
        )}
      </Stack>
    </AuthorisedLayout>
  )
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
          {formatMessage(msgs.empty_message)}
          <Link href={formatMessage(msgs.empty_message_href)}>{formatMessage(msgs.empty_message_link)}</Link>
        </Typography>
        <AddMapButton />
      </Stack>
    </Box >
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

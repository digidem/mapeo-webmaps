import { Dialog, Fade, Typography, useTheme } from '@mui/material'
import { Stack } from '@mui/system'
import { useIntl } from 'react-intl'
import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'

import { RouteComponentProps } from '@reach/router'
import { Overlay } from './styles'
import { messages as msgs } from './messages'

import { Loader } from '../../components/Loader'
import { Button } from '../../components/Button'
import { MapsList } from '../../components/MapsList'
import { AuthorisedLayout } from '../../layouts/Authorised'
import { ProgressType, useCreateMap } from '../../hooks/useCreateMap'

export const HomeView = ({ }: RouteComponentProps) => {
  const theme = useTheme()

  const {
    createMap,
    progress: { loading: uploading, failedFiles },
    progress,
  } = useCreateMap()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length || !acceptedFiles[0].name.match(/.mapeomap$/)) return
      createMap(acceptedFiles[0])
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
        {uploading || failedFiles.length ? (
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
  progress: { completed, loading, failedFiles, mapTitle = '...', retryFailedFiles },
}: UploadingType) => {
  const { formatMessage } = useIntl()

  return (
    <Dialog open maxWidth="sm" fullWidth>
      <Stack spacing={5} sx={{ padding: 5 }}>
        <Typography variant="h4" component="h2">
          {formatMessage(msgs.addingMap, { title: mapTitle })}
        </Typography>
        {failedFiles?.length && !loading ? (
          <>
            {failedFiles.length ? (
              <Typography variant="body1">
                {formatMessage(msgs.xFailedFiles, { failed: failedFiles.length })}
              </Typography>
            ) : null}
            <Stack direction="row" justifyContent="center">
              <Button fullWidth={false} onClick={retryFailedFiles}>
                {formatMessage(msgs.retryButton)}
              </Button>
            </Stack>
          </>
        ) : (
          <Loader width={100} value={completed} />
        )}
      </Stack>
    </Dialog>
  )
}

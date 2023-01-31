import { Box, Fade, Link, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import { FileUploadOutlined as UploadIcon } from '@mui/icons-material'
import { useIntl } from 'react-intl'
import { DropzoneInputProps, DropzoneRootProps, useDropzone } from 'react-dropzone'
import { useCallback, useState } from 'react'
import { AddMapButton } from '../../components/AddMapButton'
import { AuthorisedLayout } from '../../layouts/Authorised'
import { Img, Overlay } from './styles'
import { messages as msgs } from './messages'
import { unzip } from '../../helpers/file'
import { Loader } from '../../components/Loader'
import { useCreateMap } from '../../hooks/mapHooks'

export const HomeView = () => {
  const { createMap, progress, loading, error, done } = useCreateMap()
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length || !acceptedFiles[0].name.match(/.mapeomap$/))
      return console.log('invalid file', acceptedFiles[0])
    const unzippedFiles = await unzip(acceptedFiles[0])
    console.log({ unzippedFiles })
    const data = createMap(unzippedFiles)
    console.log({ data })
  }, [])
  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: ['.mapeomap'],
    onDrop,
  })
  return (
    <AuthorisedLayout onClickAddMap={open}>
      {loading ? (
        <Loader width={100} justify="flex-end" />
      ) : (
        <div {...getRootProps({ className: 'dropzone' })}>
          <DragDropOverlay active={isDragActive} />
          <NoMaps openDialog={open} getInputProps={getInputProps} isDragActive={isDragActive} />
        </div>
      )}
    </AuthorisedLayout>
  )
}

type NoMapsType = {
  openDialog: () => void
  getInputProps: (props?: DropzoneInputProps | undefined) => DropzoneInputProps
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

const NoMaps = ({ openDialog, getInputProps, isDragActive }: NoMapsType) => {
  const { formatMessage } = useIntl()
  return (
    <Box
      justifyContent="center"
      alignItems="center"
      sx={{
        width: '100%',
        height: 'calc(100vh - 80px)',
        paddingTop: '15vh',
        opacity: isDragActive ? 0.5 : 1,
      }}
    >
      <Stack direction="column" justifyContent="center" alignItems="center" spacing={5}>
        <Img src="/svg/nomap.svg" alt="" />
        <Typography variant="h3">{formatMessage(msgs.empty_title)}</Typography>
        <Typography variant="body1" align="center">
          {formatMessage(msgs.empty_message)}
          <Link display="block" href={formatMessage(msgs.empty_message_href)}>
            {formatMessage(msgs.empty_message_link)}
          </Link>
        </Typography>
        <input {...getInputProps()} />
        <AddMapButton onClick={openDialog} />
      </Stack>
    </Box>
  )
}

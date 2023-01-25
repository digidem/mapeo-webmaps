import { Box, Link, Typography } from '@mui/material'
import { Stack } from '@mui/system'

import { useIntl } from 'react-intl'
import { DropzoneInputProps, DropzoneRootProps, useDropzone } from 'react-dropzone'
import { useCallback } from 'react'
import { AddMapButton } from '../../components/AddMapButton'
import { AuthorisedLayout } from '../../layouts/Authorised'
import { Img } from './styles'

import { messages as msgs } from './messages'
import { unzip } from '../../helpers/file'

export const HomeView = () => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length || !acceptedFiles[0].name.match(/.mapeomap$/))
      return console.log('invalid file', acceptedFiles[0])
    const unzippedFiles = await unzip(acceptedFiles[0])
    console.log({ unzippedFiles })
    // createMap(files);
  }, [])
  const { getRootProps, getInputProps, open, acceptedFiles, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: ['.mapeomap'],
    onDrop,
  })

  return (
    <AuthorisedLayout onClickAddMap={open}>
      <NoMaps
        openDialog={open}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
      />
    </AuthorisedLayout>
  )
}

type NoMapsType = {
  openDialog: () => void
  getRootProps: (props?: DropzoneRootProps | undefined) => DropzoneRootProps
  getInputProps: (props?: DropzoneInputProps | undefined) => DropzoneInputProps
  isDragActive: boolean
}

const NoMaps = ({ openDialog, getRootProps, getInputProps, isDragActive }: NoMapsType) => {
  const { formatMessage } = useIntl()

  type NoMapsType = {
    openDialog: () => void
    getRootProps: (props?: DropzoneRootProps | undefined) => DropzoneRootProps
    getInputProps: (props?: DropzoneInputProps | undefined) => DropzoneInputProps
    isDragActive: boolean
  }

  const NoMaps = ({ openDialog, getRootProps, getInputProps, isDragActive }: NoMapsType) => {
    const { formatMessage } = useIntl()

    return (
      <div {...getRootProps({ className: 'dropzone' })}>
        <Box justifyContent="center" alignItems="center" sx={{ width: '100%', height: 'calc(100vh - 80px)', paddingTop: '15vh' }}>
          <Stack direction="column" justifyContent="center" alignItems="center" spacing={5}>
            <Img src="/svg/nomap.svg" alt="" />
            <Typography variant="h3">No maps to show</Typography>
            <Typography variant="body1">
              {formatMessage(msgs.empty_message)}
              <Link href={formatMessage(msgs.empty_message_href)}>{formatMessage(msgs.empty_message_link)}</Link>
            </Typography>
            <input {...getInputProps()} />
            <AddMapButton onClick={openDialog} />
          </Stack>
        </Box >
      </div>
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

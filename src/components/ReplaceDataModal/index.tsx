import { useCallback, useEffect, useState } from 'react'
import {
  UploadFile as UploadFileIcon,
  Description as FileIcon,
  ClearRounded as CrossIcon,
} from '@mui/icons-material'
import { Dialog, Stack, Typography, Button, CircularProgress, useTheme, Box } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useIntl } from 'react-intl'
import { useDropzone } from 'react-dropzone'
import { msgs } from './messages'
import { useCreateMap } from '../../hooks/useCreateMap'
import { Loader } from '../Loader'

export const ReplaceDataModal = ({ id, mapTitle, onClose, open, refreshIframe }: ReplaceDataModalProps) => {
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const [file, setFile] = useState<File | null>(null)
  const [saved, setSaved] = useState(false)
  let clearTimer: NodeJS.Timeout | undefined

  const {
    updateMapData,
    progress: { loading: saving, completed: progress, failedFiles, retryFailedFiles },
    reset,
  } = useCreateMap()

  if (progress === 100 && !saved) {
    setSaved(true)
    reset()
    refreshIframe()
  }

  const clearFile = () => setFile(null)

  const handleCloseDialog = (event?: Record<string, never>, reason?: 'escapeKeyDown' | 'backdropClick') => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
    handleClose()
  }

  const handleClose = () => {
    console.log('closing')
    onClose()

    clearTimer = setTimeout(() => {
      clearFile()
      setSaved(false)
    }, 500)
  }

  const submit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    if (!file) return
    await updateMapData(file, id)
  }

  const onDropFile = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length || !acceptedFiles[0].name.match(/.mapeomap$/)) return
    setFile(acceptedFiles[0])
  }, [])

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return () => {
      if (clearTimer) {
        clearTimeout(clearTimer)
      }
    }
  })

  return (
    <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
      {!saved ? (
        <Stack spacing={5} sx={{ padding: 5 }} component="form">
          <Typography variant="h4" component="h2">
            {formatMessage(msgs.replaceMapDataTitle)}
          </Typography>

          <Stack spacing={3}>
            <Typography variant="h6" component="label" align="center">
              {formatMessage(msgs.replaceMapDataSubtitle, { title: mapTitle })}
            </Typography>

            <UploadButton
              onDropFile={onDropFile}
              file={file}
              clearFile={clearFile}
              progress={progress}
              saving={saving}
              saved={saved}
            />

            <Stack direction="row" justifyContent="flex-end">
              <Button
                color="inherit"
                onClick={handleClose}
                disabled={saving}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  opacity: 0.8,
                }}
              >
                {formatMessage(msgs.cancel)}
              </Button>
              <Button
                onSubmit={failedFiles.length ? retryFailedFiles : submit}
                onClick={submit}
                variant="contained"
                disabled={!file || saving || saved}
                size="large"
                type="submit"
                disableElevation
                sx={{
                  borderRadius: 8,
                  textTransform: 'none',
                  fontWeight: 600,
                  paddingX: 8,
                  paddingY: 2,
                  marginLeft: 4,
                  '&.Mui-disabled': {
                    backgroundColor: theme.primary,
                    color: theme.white,
                    opacity: 0.5,
                  },
                }}
              >
                <RenderButtonContents saving={saving} saved={saved} failedFiles={failedFiles} />
              </Button>
            </Stack>
          </Stack>
        </Stack>
      ) : (
        <SuccessContents onClose={handleClose} />
      )}
    </Dialog>
  )
}

const SuccessContents = ({ onClose }: { onClose: () => void }) => {
  const { formatMessage } = useIntl()

  return (
    <Stack alignItems="center" spacing={4} sx={{ padding: 5 }}>
      <CheckCircleIcon color="success" sx={{ height: 100, width: 100 }} />
      <Stack spacing={2}>
        <Typography variant="h3" align="center">
          {formatMessage(msgs.successTitle)}
        </Typography>
        <Typography variant="body1" align="center">
          {formatMessage(msgs.successMessage)}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="flex-end" alignSelf="flex-end">
        <Button variant="text" onClick={onClose}>
          {formatMessage(msgs.ok)}
        </Button>
      </Stack>
    </Stack>
  )
}

const RenderButtonContents = ({
  saving,
  saved,
  failedFiles,
}: {
  saving: boolean
  saved: boolean
  failedFiles: string[]
}) => {
  const { formatMessage } = useIntl()

  if (saving) return <CircularProgress sx={{ color: 'white' }} size={26} />

  if (failedFiles.length) return <span>{formatMessage(msgs.retry)}</span>

  return saved ? (
    <span>{formatMessage(msgs.saved)}</span>
  ) : (
    <span>{formatMessage(msgs.replaceDataButton)}</span>
  )
}

const UploadButton = ({
  onDropFile,
  file,
  clearFile,
  progress,
  saving,
}: {
  onDropFile: (acceptedFiles: File[]) => void
  file: File | null
  clearFile: () => void
  progress: number
  saving: boolean
  saved: boolean
}) => {
  const { formatMessage } = useIntl()
  const theme = useTheme()

  const {
    getRootProps,
    getInputProps,
    open: openFileUpload,
    isDragActive,
  } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: ['.mapeomap'],
    onDrop: onDropFile,
  })

  return file ? (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ backgroundColor: theme.background, width: '100%', padding: 2 }}
      >
        <Stack direction="row" alignItems="center">
          <FileIcon sx={{ marginRight: 1 }} />
          <Typography variant="body1" component="label" align="center">
            {file.name}
          </Typography>
        </Stack>
        {!saving && <CrossIcon onClick={clearFile} sx={{ cursor: 'pointer' }} />}
      </Box>
      <Loader width={saving ? 100 : 0} value={progress} />
    </div>
  ) : (
    <div {...getRootProps({ className: 'dropzone' })}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: theme.background,
          width: '100%',
          padding: 5,
          border: '1px dashed grey',
          cursor: 'pointer',
        }}
        onClick={openFileUpload}
      >
        <input {...getInputProps()} />

        <Typography variant="body1" component="label" align="center" mr={1} sx={{ cursor: 'pointer' }}>
          {isDragActive ? formatMessage(msgs.uploadButtonDropLabel) : formatMessage(msgs.uploadButtonLabel)}
        </Typography>
        <UploadFileIcon
          sx={{
            cursor: 'pointer',
            transform: `translateY(${isDragActive ? '-5px' : '0'})`,
            transition: '0.3s transform ease-in-out',
          }}
        />
      </Box>
    </div>
  )
}

type ReplaceDataModalProps = {
  mapTitle: string
  id: string
  onClose: () => void
  refreshIframe: () => void
  open: boolean
}

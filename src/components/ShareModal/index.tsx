import {
  Dialog,
  Stack,
  Typography,
  InputAdornment,
  TextField,
  IconButton,
  useTheme,
  Tooltip,
} from '@mui/material'
import { useIntl } from 'react-intl'
import { CopyAll, Check } from '@mui/icons-material'
import { msgs } from './messages'
import { useTimeoutState } from '../../hooks/utility'

const getIframeString = (src: string) => `<iframe src="${src}"></iframe>`

export const ShareModal = ({ mapTitle, shareUrl, onClose, open }: ShareModalProps) => {
  const { formatMessage } = useIntl()
  const iframeCode = getIframeString(shareUrl)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Stack spacing={5} sx={{ padding: 5 }}>
        <Typography variant="h4" component="h2">
          {mapTitle}
        </Typography>

        <Stack spacing={1}>
          <Typography variant="h6" fontWeight="bold" component="h3">
            {formatMessage(msgs.urlTitle)}
          </Typography>
          <Typography variant="body1" component="p">
            {formatMessage(msgs.urlMessage)}
          </Typography>
          <ReadOnlyTextField value={shareUrl} type="url" />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="h6" fontWeight="bold" component="h3">
            {formatMessage(msgs.embedTitle)}
          </Typography>
          <Typography variant="body1" component="p">
            {formatMessage(msgs.embedMessage)}
          </Typography>
          <ReadOnlyTextField value={iframeCode} type="code" />
        </Stack>
      </Stack>
    </Dialog>
  )
}

const ReadOnlyTextField = ({ value, type }: { value: string; type: 'url' | 'code' }) => {
  const { formatMessage } = useIntl()
  const theme = useTheme()
  const [copied, setCopied] = useTimeoutState(3000)

  const copyMessage = type === 'code' ? formatMessage(msgs.copyCode) : formatMessage(msgs.copyUrl)

  const handleClickCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied()
  }

  return (
    <TextField
      value={value}
      variant="outlined"
      InputProps={{
        sx: {
          paddingRight: 1,
        },
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip
              title={copied ? formatMessage(msgs.copied) : copyMessage}
              placement="top"
              leaveDelay={copied ? 1000 : 150}
            >
              <IconButton
                onClick={handleClickCopy}
                sx={{
                  backgroundColor: theme.primary,
                  color: theme.white,
                  padding: 1,
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: theme.white,
                    color: theme.primary,
                    border: 1,
                  },
                }}
              >
                {copied ? <Check /> : <CopyAll />}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  )
}

type ShareModalProps = {
  mapTitle: string
  shareUrl: string
  onClose: () => void
  open: boolean
}

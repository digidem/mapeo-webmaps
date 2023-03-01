import { Dialog, DialogTitle, Stack, Typography } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useIntl } from 'react-intl'
import { messages as msgs } from './messages'

type DeleteMapModalProps = {
  open: boolean
  mapTitle: string
}

export const DeleteMapModal = ({ open, mapTitle }: DeleteMapModalProps) => {
  const { formatMessage: t } = useIntl()
  return (
    <Dialog open={open} sx={{ display: 'flex', justifyContent: 'center' }}>
      <Stack display="flex" alignItems="center" justifyContent="center">
        <DeleteForeverIcon sx={{ fontSize: 150 }} />
      </Stack>

      <Stack display="flex" alignItems="center" justifyContent="center">
        <DialogTitle>
          <Typography variant="h1" fontSize={32}>
            {t(msgs.delete_title, { mapTitle })}
          </Typography>
        </DialogTitle>
      </Stack>

      <Stack display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h2" fontSize={24}>
          {t(msgs.cannot_undo)}
        </Typography>
      </Stack>
    </Dialog>
  )
}

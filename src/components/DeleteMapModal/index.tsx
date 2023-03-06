import { Dialog, DialogTitle, Stack, Typography, Button, Box } from '@mui/material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { useIntl } from 'react-intl'
import { doc, deleteDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../..'
import { messages as msgs } from './messages'

type DeleteMapModalProps = {
  open: boolean
  mapTitle: string
  closeModal: () => void
  id: string | number
}

export const DeleteMapModal = ({ open, mapTitle, closeModal, id }: DeleteMapModalProps) => {
  const { formatMessage: t } = useIntl()
  const [user] = useAuthState(auth)

  const deleteMap = async () => {
    if (!user) return
    await deleteDoc(doc(db, `groups/${user.uid}/maps`, `${id}`))
  }

  return (
    <Dialog open={open}>
      <Stack display="flex" alignItems="center" justifyContent="center" padding={5} spacing={3}>
        <DeleteForeverIcon sx={{ fontSize: 150 }} />

        <DialogTitle>
          <Typography variant="h1" fontSize={32} align="center">
            {t(msgs.delete_title, { mapTitle })}
          </Typography>
        </DialogTitle>

        <Typography variant="h2" fontSize={24} fontWeight={800}>
          {t(msgs.cannot_undo)}
        </Typography>

        <Typography variant="h3" fontSize={24} align="center">
          {t(msgs.will_be_deleted)}
        </Typography>

        <Box display="flex" alignItems="space-between" justifyContent="space-between">
          <Button
            color="error"
            onClick={deleteMap}
            variant="contained"
            disableElevation
            sx={{
              borderRadius: 5,
              display: 'flex',
              justifyContent: 'space-between',
              textTransform: 'none',
              fontWeight: 600,
              marginRight: 5,
            }}
          >
            {t(msgs.delete_button)}
          </Button>
          <Button
            onClick={closeModal}
            sx={{
              borderRadius: 5,
              display: 'flex',
              justifyContent: 'space-between',
              textTransform: 'none',
              fontWeight: 600,
              color: 'black',
            }}
          >
            <Typography>{t(msgs.keep_button)}</Typography>
          </Button>
        </Box>
      </Stack>
    </Dialog>
  )
}

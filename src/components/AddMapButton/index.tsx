import { Add as AddIcon } from '@mui/icons-material'
import { defineMessages, useIntl } from 'react-intl'
import { useDropzoneMaps } from '../../hooks/useDropzoneMaps'
import { Button } from '../Button'

const msgs = defineMessages({
  addMap: {
    id: 'add_map_button',
    defaultMessage: 'Add Map',
  },
})

export const AddMapButton = () => {
  const message = useIntl().formatMessage(msgs.addMap)

  const { open, getInputProps } = useDropzoneMaps()

  return (
    <>
      <input {...getInputProps()} />
      <Button fullWidth={false} icon={AddIcon} onClick={open}>
        {message}
      </Button>
    </>
  )
}

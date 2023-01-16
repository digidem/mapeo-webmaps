import { Add as AddIcon } from '@mui/icons-material'
import { defineMessages, useIntl } from 'react-intl'
import Button from '../Button'

const msgs = defineMessages({
  addMap: {
    id: 'add_map_button',
    defaultMessage: 'Add Map',
  },
})

export const AddMapButton = () => {
  const addMap = () => null // TODO: Implement addMapp functionality.
  const message = useIntl().formatMessage(msgs.addMap)
  return (
    <Button fullWidth={false} icon={AddIcon} onClick={addMap}>
      {message}
    </Button>
  )
}

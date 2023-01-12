import { Button } from '../Button'
import { Add as AddIcon } from '@mui/icons-material';
import { defineMessages, useIntl } from 'react-intl'

const msgs = defineMessages({
  addMap: {
    id: 'add_map_button',
    defaultMessage: 'Add Map',
  },
})

type AddMapButtonTypes = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const AddMapButton = ({ onClick }: AddMapButtonTypes) => {
  const message = useIntl().formatMessage(msgs.addMap)

  return (
    <Button fullWidth={false} icon={AddIcon} onClick={onClick}>{message}</Button>
  )
}


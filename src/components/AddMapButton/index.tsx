import Button from '../Button'
import { Add as AddIcon } from '@mui/icons-material';

export const AddMapButton = () => {
  const addMap = () => null // TODO: Implement addMapp functionality.
  return (
    <Button fullWidth={false} icon={AddIcon} onClick={addMap}>Add map</Button>
  )
}
import { Box, FormControl, FormLabel } from '@mui/material'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import { ReactNode, useState } from 'react'
import { useIntl } from 'react-intl'
import { Stack } from '@mui/system'
import { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { StyledSelect as Select } from './styles'
import { msgs } from './messages'

export const SortToggle = ({ value, onChange, direction }: SortToggleProps) => {
  const { formatMessage } = useIntl()
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <FormControl sx={{ m: 1, minWidth: 120, cursor: 'pointer' }} size="small" variant="standard">
      <Stack direction="row">
        <ImportExportIcon onClick={handleOpen} />
        <FormLabel
          focused={false}
          onClick={handleOpen}
          sx={{
            position: 'relative',
            top: 1,
            color: 'black',
            fontWeight: 'bold',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {formatMessage(msgs.sort)}
        </FormLabel>
        <Space />
        <Select
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={value}
          onChange={onChange}
          IconComponent={() => null}
        >
          <MenuItem value="createdAt">{formatMessage(msgs.dateAdded)}</MenuItem>
          <MenuItem value="title">{formatMessage(msgs.byTitle)}</MenuItem>
        </Select>
      </Stack>
    </FormControl>
  )
}

const Space = () => (
  <Box component="span" sx={{ display: 'inline-block', whiteSpace: 'pre', userSelect: 'none' }}>
    {' '}
  </Box>
)

export type SortDirectionType = 'asc' | 'desc'
export type SortType = 'createdAt' | 'title'

type SortToggleProps = {
  value: SortType
  onChange: (event: SelectChangeEvent<unknown>, child: ReactNode) => void
  direction: SortDirectionType
}

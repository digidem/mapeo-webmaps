import { Box, FormControl, FormLabel } from '@mui/material'
import { useState } from 'react'
import { useIntl } from 'react-intl'
import { Stack } from '@mui/system'
import MenuItem from '@mui/material/MenuItem'
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material'
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
          IconComponent={() => null}
        >
          <MenuItem value="createdAt" onClick={() => onChange('createdAt')}>
            {formatMessage(msgs.dateAdded)}{' '}
          </MenuItem>
          <MenuItem value="title" onClick={() => onChange('title')}>
            {formatMessage(msgs.byTitle)}
          </MenuItem>
        </Select>
        {direction === 'asc' ? (
          <KeyboardArrowDown onClick={handleOpen} />
        ) : (
          <KeyboardArrowUp onClick={handleOpen} />
        )}
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
  onChange: (sortValue: SortType) => void
  direction: SortDirectionType
}

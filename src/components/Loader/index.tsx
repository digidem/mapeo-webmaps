import { LinearProgress, Stack } from '@mui/material'

type LoaderTypes = { width?: number; justify?: 'flex-start' | 'flex-end' | 'center'; value?: number }

export const Loader = ({ width = 70, justify = 'center', value }: LoaderTypes) => (
  <Stack justifyContent={justify} alignItems="center">
    <LinearProgress
      color="primary"
      variant={typeof value === 'number' && value !== 0 ? 'determinate' : 'indeterminate'}
      value={value}
      sx={{ height: '10px', width: `${width}%` }}
    />
  </Stack>
)

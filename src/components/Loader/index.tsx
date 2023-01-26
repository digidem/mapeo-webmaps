import { LinearProgress, Stack } from '@mui/material'

type LoaderTypes = { width?: number; justify?: 'flex-start' | 'flex-end' | 'center' }

export const Loader = ({ width = 70, justify = 'center' }: LoaderTypes) => (
  <Stack justifyContent={justify} alignItems="center" sx={{ height: 'calc(100vh - 80px)' }}>
    <LinearProgress color="primary" sx={{ height: '10px', width: `${width}%` }} />
  </Stack>
)

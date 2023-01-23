import { LinearProgress, Stack } from '@mui/material'

export const Loader = () => (
  <Stack justifyContent="center" alignItems="center" sx={{ height: 'calc(100vh - 80px)' }}>
    <LinearProgress color="primary" sx={{ height: '10px', maxWidth: '70vw' }} />
  </Stack>
)

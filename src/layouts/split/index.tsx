import { Stack, Container, Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { SplitLayoutTypes } from './types'

const defaultGridStyles = [{
  backgroundColor: 'background.dark',
  color: 'white'
}, {
  backgroundColor: 'background.light',
  color: 'black'
}]

const SplitLayout = ({ children, grid = [5, 7], gridStyles = defaultGridStyles, columns = 12 }: SplitLayoutTypes) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.light',
      }}
    >
      <Grid container columns={columns}>
        <Grid xs={grid[0]} sx={{
          minHeight: '100vh',
          ...(gridStyles[0] ?? {})
        }}>
          {children[0] || null}
        </Grid>
        <Grid xs={grid[1]} sx={{
          minHeight: '100vh',
          ...(gridStyles[1] ?? {})
        }}>
          {children[1] || null}
        </Grid>
      </Grid>
    </Box >
  )
}

export default SplitLayout
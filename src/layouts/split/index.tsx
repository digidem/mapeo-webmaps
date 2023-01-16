import { Box, useTheme } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { SplitLayoutTypes } from './types'

export const SplitLayout = ({ children, grid = [4, 8], gridStyles, columns = 12 }: SplitLayoutTypes) => {
  const theme = useTheme()

  const defaultGridStyles = [
    {
      backgroundColor: theme.blueDark,
      color: theme.white,
    },
    {
      backgroundColor: theme.background,
      color: theme.black,
    },
  ]

  const gridStylesInternal = gridStyles || defaultGridStyles

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background',
      }}
    >
      <Grid container columns={columns}>
        <Grid
          xs={grid[0]}
          bgcolor={gridStylesInternal[0].backgroundColor}
          color={gridStylesInternal[0].color}
          sx={{
            minHeight: '100vh',
            overflow: 'hidden',
          }}
        >
          {children[0] || null}
        </Grid>
        <Grid
          xs={grid[1]}
          bgcolor={gridStylesInternal[1].backgroundColor}
          color={gridStylesInternal[1].color}
          sx={{
            minHeight: '100vh',
            overflow: 'hidden',
          }}
        >
          {children[1] || null}
        </Grid>
      </Grid>
    </Box>
  )
}

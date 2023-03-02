import { Box, Stack } from '@mui/material'

export const Container = ({
  children,
  isDragActive,
  alignItems = 'center',
  spacing = 0,
  paddingTop = '15vh',
}: {
  children: React.ReactNode
  isDragActive?: boolean
  alignItems?: React.CSSProperties['alignItems']
  spacing?: number
  paddingTop?: string
}) => (
  <Box
    justifyContent="center"
    alignItems="flex-start"
    sx={{
      width: '100%',
      height: 'calc(100vh - 80px)',
      paddingTop,
      opacity: isDragActive ? 0.5 : 1,
      display: 'flex',
    }}
  >
    <Stack
      direction="column"
      justifyContent="center"
      alignItems={alignItems}
      maxWidth={750}
      width="100%"
      spacing={spacing}
    >
      {children}
    </Stack>
  </Box>
)

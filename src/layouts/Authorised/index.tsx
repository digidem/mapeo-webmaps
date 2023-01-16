import { Box } from '@mui/material'
import { Header } from '../../components/Header'

type AuthorisedLayoutProps = {
  renderHeader?: React.ComponentType
  children: React.ReactNode
}

export const AuthorisedLayout = ({ renderHeader: CustomHeader, children }: AuthorisedLayoutProps) => (
  <Box
    sx={{
      minHeight: "100vh",
      backgroundColor: "background",
    }}
  >
    <>
      <Header>{CustomHeader ? <CustomHeader /> : null}</Header>
      {children}
    </>
  </Box>
)

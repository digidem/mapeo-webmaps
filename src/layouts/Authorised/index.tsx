import { Box } from '@mui/material'
import { Header } from '../../components/Header'

type AuthorisedLayoutProps = {
  renderHeader?: React.ComponentType
  children: React.ReactNode
  onClickAddMap: () => void
}

type AuthorisedCustomHeaderProps = {
  renderHeader: React.ComponentType
  children: React.ReactNode
  onClickAddMap?: () => void
}

export const AuthorisedLayout = ({
  renderHeader: CustomHeader,
  children,
  onClickAddMap,
}: AuthorisedLayoutProps | AuthorisedCustomHeaderProps) => (
  <Box
    sx={{
      minHeight: '100vh',
      backgroundColor: 'background',
    }}
  >
    <>
      <Header onClickAddMap={onClickAddMap}>{CustomHeader ? <CustomHeader /> : null}</Header>
      {children}
    </>
  </Box>
)

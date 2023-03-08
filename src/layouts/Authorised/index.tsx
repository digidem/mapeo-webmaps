import { Box } from '@mui/material'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Helmet } from 'react-helmet'
import { SITE_TITLE } from '../..'
import { Header } from '../../components/Header'

type AuthorisedLayoutProps = {
  title?: string
  renderHeader?: React.ComponentType
  children: React.ReactNode
  onClickAddMap: () => void
}

type AuthorisedCustomHeaderProps = {
  title?: string
  renderHeader: React.ComponentType
  children: React.ReactNode
  onClickAddMap?: () => void
}

export const AuthorisedLayout = ({
  title,
  renderHeader: CustomHeader,
  children,
  onClickAddMap,
}: AuthorisedLayoutProps | AuthorisedCustomHeaderProps) => {
  const pageTitle = title ? `${title} | ${SITE_TITLE}` : SITE_TITLE
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background',
      }}
    >
      <>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>
        <Header onClickAddMap={onClickAddMap}>{CustomHeader ? <CustomHeader /> : null}</Header>
        {children}
      </>
    </Box>
  )
}

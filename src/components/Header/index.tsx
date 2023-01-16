import { Stack, Typography } from '@mui/material'
import { useAuthState } from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth'
import { Box, StackBaseProps } from '@mui/system'

import { useIntl } from 'react-intl'
import { Link } from '@reach/router'
import { HeaderWrapper, LogoImg, LogOutButton, Block } from './styles'
import { auth } from '../..'
import { AddMapButton } from '../AddMapButton'
import { messages as msgs } from './messages'

type HeaderProps = {
  children?: React.ReactNode
  onClickAddMap: () => void
}

type JustifyContentProperty =
  | "space-between"
  | "center"
  | "flex-start"
  | "flex-end";

type RowProps = StackBaseProps & {
  children: React.ReactNode
  padding?: number | string
  justify?: JustifyContentProperty
}

const Row = ({ padding = 0, justify = 'space-between', ...rest }: RowProps) => (
  <Stack
    direction="row"
    justifyContent={justify}
    alignItems="center"
    sx={{
      padding: `${typeof padding === 'number' ? `${padding}px` : padding}`,
    }}
    {...rest}
  />
)

export const Header = ({ children, onClickAddMap }: HeaderProps) => {
  const { formatMessage } = useIntl()
  const [user] = useAuthState(auth)

  const handleLogOut = () => {
    signOut(auth).catch((error: ErrorCallback) => {
      console.log({ error })
      // An error happened.
    })
  }

  return (
    <HeaderWrapper>
      {children || (
        <Row padding="0 0 0 18px">
          <Block>
            <AddMapButton onClick={onClickAddMap} />
          </Block>

          <Link to="/">
            <Block centered>
              <LogoImg src="/svg/logo-w.svg" alt="" />
            </Block>
          </Link>
          <Block>
            <Row spacing={3} justify="flex-end">
              {user ? (
                <Typography variant="body1" color="white" sx={{ cursor: 'text' }} component="label">
                  {user.email}
                </Typography>
              ) : null}
              {user ? (
                <LogOutButton onClick={handleLogOut}>{formatMessage(msgs.log_out)}</LogOutButton>
              ) : null}
            </Row>
          </Block>
        </Row>
      )}
    </HeaderWrapper>
  )
}

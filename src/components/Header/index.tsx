import { Stack, Typography } from "@mui/material"
import { useAuthState } from "react-firebase-hooks/auth";
import { ChildType } from "../../types"
import AddIcon from '@mui/icons-material/Add';
import Button from "../Button"
import { HeaderWrapper, LogoImg, LogOutButton, Block } from "./styles"
import { auth } from "../..";
import { signOut } from "@firebase/auth";
import { FlexboxProps, StackBaseProps } from "@mui/system";

type HeaderProps = {
  children?: ChildType
}

type JustifyContentProperty = 'space-between' | 'center' | 'flex-start' | 'flex-end'

type RowProps = StackBaseProps & {
  children: ChildType,
  padding?: number | string,
  justify?: JustifyContentProperty,
}

const Row = ({ padding = 0, justify = 'space-between', ...rest }: RowProps) => <Stack direction="row" justifyContent={justify} alignItems="center" sx={{
  padding: `${typeof padding === 'number' ? `${padding}px` : padding}`
}} {...rest} />


const Header = ({ children }: HeaderProps) => {
  const [user, authorizing] = useAuthState(auth)

  const handleLogOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error: ErrorCallback) => {
      console.log({ error })
      // An error happened.
    });

  }

  return (

    <HeaderWrapper>
      {children ? children : (
        <Row padding="0 0 0 18px">
          <Block><Button fullWidth={false} icon={AddIcon}>Add map</Button></Block>
          <Block centered>
            <LogoImg src="/svg/logo-w.svg" alt="" />
          </Block>
          <Block >
            <Row spacing={3} justify="flex-end">
              {user ? <Typography variant="body1" color="white" sx={{ cursor: 'text' }} component="label">{user.email}</Typography> : null}
              {user ? <LogOutButton onClick={handleLogOut}>Log out</LogOutButton> : null}
            </Row>
          </Block>
        </Row>
      )}
    </HeaderWrapper>
  )
}

export default Header
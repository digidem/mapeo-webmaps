import { Box, useTheme } from "@mui/material";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

type IconBadgeProps = {
  icon?: React.ComponentType
  colour?: React.CSSProperties['backgroundColor']
  backgroundColor?: React.CSSProperties['backgroundColor']
}

const IconBadge = ({ icon, colour, backgroundColor }: IconBadgeProps) => {
  const theme = useTheme()
  const RenderIcon = icon || LockOutlinedIcon
  const background = backgroundColor || theme.warningRed
  const iconColor = colour || theme.white

  return <Box sx={{
    backgroundColor: background,
    borderRadius: '100%',
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    padding: 1
  }}>
    <RenderIcon sx={{
      color: iconColor
    }} />
  </Box>
}

export default IconBadge
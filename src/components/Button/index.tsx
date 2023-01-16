import EastIcon from '@mui/icons-material/East'
import { ButtonBaseProps, ButtonProps, CircularProgress, SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { LoadingButton } from './styles'

type ButtonPropTypes = ButtonProps & {
  children: React.ReactNode
  icon?: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>
  onSubmit?: (event: React.FormEvent<HTMLButtonElement>) => void
  onClick?: (event: React.FormEvent<HTMLButtonElement>) => void
  loading?: boolean
  disabled?: null | boolean | undefined
  fullWidth?: boolean
}

const Button = ({
  children,
  onSubmit,
  loading,
  disabled,
  icon: Icon = EastIcon,
  fullWidth = true,
  ...rest
}: ButtonPropTypes) => (
  <LoadingButton
    data-testid="submit-button"
    type="submit"
    fullWidth={fullWidth}
    size="large"
    variant="contained"
    color="primary"
    sx={{
      borderRadius: 5,
      display: 'flex',
      justifyContent: 'space-between',
      textTransform: 'none',
      fontWeight: 600,
    }}
    endIcon={loading ? <CircularProgress sx={{ color: 'white' }} size="1em" /> : <Icon />}
    onSubmit={onSubmit}
    disabled={disabled || loading}
    disableElevation
    {...rest}
  >
    {children}
  </LoadingButton>
)

export default Button
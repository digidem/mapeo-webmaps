import EastIcon from '@mui/icons-material/East'
import { CircularProgress } from '@mui/material'
import { LoadingButton } from './styles'


type ButtonPropTypes = {
  children: React.ReactNode
  icon?: React.ComponentType
  onSubmit?: (event: React.FormEvent<HTMLButtonElement>) => void
  onClick?: (event: React.FormEvent<HTMLButtonElement>) => void
  loading?: boolean
  disabled?: null | boolean | undefined
  fullWidth?: boolean
}

const Button = ({ children, onSubmit, loading, disabled, icon: Icon = EastIcon, fullWidth = true, ...rest }: ButtonPropTypes) => (
  <LoadingButton
    data-testid="submit-button"
    type="submit"
    fullWidth={fullWidth}
    size="large"
    variant="contained"
    color="primary"
    sx={{ borderRadius: 5, display: 'flex', justifyContent: 'space-between', textTransform: 'none', fontWeight: 600 }}
    endIcon={loading ? <CircularProgress sx={{ color: 'white' }} size="1em" /> : <Icon />}
    onSubmit={onSubmit}
    disabled={disabled || loading}
    {...rest}
  >
    {children}
  </LoadingButton>
)

export default Button
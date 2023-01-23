import EastIcon from '@mui/icons-material/East'
import { ButtonProps, CircularProgress, SvgIconTypeMap } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import { StyledButton } from './styles'

type ButtonPropTypesHelper = ButtonProps & {
  children: React.ReactNode
  icon?: OverridableComponent<SvgIconTypeMap>
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

type ButtonPropTypesOnClick = ButtonPropTypesHelper & {
  onSubmit?: (event: React.FormEvent<HTMLButtonElement>) => void
  onClick: (event: React.FormEvent<HTMLButtonElement>) => void // required here
}

type ButtonPropTypesOnSubmit = ButtonPropTypesHelper & {
  onSubmit: (event: React.FormEvent<HTMLButtonElement>) => void // required here
  onClick?: (event: React.FormEvent<HTMLButtonElement>) => void
}

type ButtonPropTypes = ButtonPropTypesOnSubmit | ButtonPropTypesOnClick

export const Button = ({
  children,
  onSubmit,
  loading,
  disabled,
  icon: Icon = EastIcon,
  fullWidth = true,
  ...rest
}: ButtonPropTypes) => (
  <StyledButton
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
  </StyledButton>
)

import EastIcon from '@mui/icons-material/East'
import { CircularProgress } from '@mui/material'
import { LoadingButton } from './styles'


type FormButtonPropTypes = {
  children: React.ReactNode
  onSubmit: (event: React.FormEvent<HTMLButtonElement>) => void
  loading?: boolean
  disabled?: null | boolean | undefined
}

const FormButton = ({ children, onSubmit, loading, disabled, ...rest }: FormButtonPropTypes) => (
  <LoadingButton
    data-testid="submit-button"
    type="submit"
    fullWidth
    size="large"
    variant="contained"
    color="primary"
    sx={{ borderRadius: 5, display: 'flex', justifyContent: 'space-between', textTransform: 'none', fontWeight: 600 }}
    endIcon={loading ? <CircularProgress sx={{ color: 'white' }} size="1em" /> : <EastIcon />}
    onSubmit={onSubmit}
    disabled={disabled || loading}
    {...rest}
  >
    {children}
  </LoadingButton>
)

export default FormButton
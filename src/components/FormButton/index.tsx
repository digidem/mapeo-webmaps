import EastIcon from '@mui/icons-material/East'
import { Button, ButtonTypeMap } from '@mui/material'

type FormButtonPropTypes = & {
  children: React.ReactNode
  onSubmit: () => void
}

const FormButton = ({ children, onSubmit, ...rest }: FormButtonPropTypes) => (
  <Button
    data-testid="submit-button"
    type="submit"
    fullWidth
    size="large"
    variant="contained"
    color="primary"
    sx={{ borderRadius: 5, display: 'flex', justifyContent: 'space-between', textTransform: 'none', fontWeight: 600 }}
    endIcon={<EastIcon />}
    onSubmit={onSubmit}
    {...rest}
  >
    {children}
  </Button>
)

export default FormButton
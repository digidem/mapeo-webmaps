import { ThemeProvider, Typography } from '@mui/material';
import SplitLayout from '../../layouts/split';
import CssBaseline from "@mui/material/CssBaseline";

import theme from '../../theme';


const App = () => (
  <>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <SplitLayout>
        <Typography variant="h1" component="h2">
          Left
        </Typography>
        <Typography variant="h1" component="h2">
          Right
        </Typography>

      </SplitLayout>
    </ThemeProvider>
  </>
);

export default App;


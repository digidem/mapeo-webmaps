import { createTheme } from "@mui/system";

const MAPEO_BLUE = '#0066FF'
const MAPEO_BLACK = '#333333'
const MAPEO_ORANGE = '#EA7913'
const DARK_BLUE = '#000033'
const WARNING_RED = '#D92222'

const theme = createTheme({
  typography: {
    fontFamily: [
      'Rubik',
      'Roboto',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    background: {
      light: '#F4F4FF',
      dark: DARK_BLUE,
    },
    primary: MAPEO_BLUE,
    error: {
      main: WARNING_RED
    },
    black: MAPEO_BLACK,
    orange: MAPEO_ORANGE
  }
});


export default theme
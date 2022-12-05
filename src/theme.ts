import { createTheme } from "@mui/system";

const mapeoBlue = '#0066FF'
const mapeoBlack = '#333333'
const mapeoOrange = '#EA7913'
const darkBlue = '#000033'
const warningRed = '#D92222'

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
      dark: darkBlue,
    },
    primary: mapeoBlue,
    error: {
      main: warningRed
    },
    black: mapeoBlack,
    orange: mapeoOrange
  }
});


export default theme
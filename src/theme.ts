import { createTheme } from "@mui/material";



declare module '@mui/material/styles' {
  interface Theme {
    primary: React.CSSProperties['color']
    background: React.CSSProperties['color']
    blueDark: React.CSSProperties['color']
    warningRed: React.CSSProperties['color']
    black: React.CSSProperties['color']
    orange: React.CSSProperties['color']
    white: React.CSSProperties['color']
    limeGreen: {
      main: React.CSSProperties['color']
      light: React.CSSProperties['color']
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    primary: React.CSSProperties['color']
    background: React.CSSProperties['color']
    blueDark: React.CSSProperties['color']
    warningRed: React.CSSProperties['color']
    black: React.CSSProperties['color']
    orange: React.CSSProperties['color']
    white: React.CSSProperties['color']
    limeGreen: {
      main: React.CSSProperties['color']
      light: React.CSSProperties['color']
    }
  }
}

const mapeoBlue = '#0066FF'
const backgroundLight = '#F4F4FF'
const mapeoBlack = '#333333'
const mapeoOrange = '#EA7913'
const darkBlue = '#000033'
const warningRed = '#CB355B'
const white = '#FFFFFF'
const limeGreen = {
  main: '#C4FFD5',
  light: '#E5FFE5'
}

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
  background: backgroundLight,
  blueDark: darkBlue,
  primary: mapeoBlue,
  warningRed,
  black: mapeoBlack,
  orange: mapeoOrange,
  white,
  limeGreen,
  palette: {
    primary: { main: mapeoBlue }
  }
});


export default theme
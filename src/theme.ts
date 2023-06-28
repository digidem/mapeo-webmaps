import { createTheme } from '@mui/material'

declare module '@mui/material/styles' {
  interface Theme {
    primary: React.CSSProperties['color']
    background: React.CSSProperties['color']
    blueDark: React.CSSProperties['color']
    warningRed: React.CSSProperties['color']
    black: React.CSSProperties['color']
    orange: React.CSSProperties['color']
    white: React.CSSProperties['color']
    limeGreen: React.CSSProperties['color']
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
    limeGreen: React.CSSProperties['color']
  }
}

const MAPEO_BLUE = '#0066FF'
const MAPEO_BLACK = '#333333'
const MAPEO_ORANGE = '#EA7913'
const DARK_BLUE = '#000033'
const WARNING_RED = '#D92222'
const WHITE = '#FFFFFF'
const LIME_GREEN = '#3fe56f'
const BACKGROUND_LIGHT = '#F4F4FF'

export const theme = createTheme({
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
  background: BACKGROUND_LIGHT,
  blueDark: DARK_BLUE,
  primary: MAPEO_BLUE,
  warningRed: WARNING_RED,
  black: MAPEO_BLACK,
  orange: MAPEO_ORANGE,
  white: WHITE,
  limeGreen: LIME_GREEN,
  palette: {
    primary: { main: MAPEO_BLUE },
    success: { main: LIME_GREEN },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        // disableElevation: true,
      },
    },
  },
})

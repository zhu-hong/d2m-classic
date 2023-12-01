import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#058373',
    },
    secondary: {
      main: '#000c25',
    },
    warning: {
      main: '#FF9900',
    },
    error: {
      main: '#F04848',
    },
    info: {
      main: '#646A73',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        style: {
          borderRadius: '0',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
        style: {
          borderRadius: '0',
        },
      },
    },
  },
})

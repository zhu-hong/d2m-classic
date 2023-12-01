import { createTheme } from '@mui/material'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#058373',
    },
    secondary: {
      main: '#000c25',
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
  },
})

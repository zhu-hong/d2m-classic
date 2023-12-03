import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './style.js'
import { theme } from './theme.js'

import { ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import { router } from './router.jsx'

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { zhCN } from '@mui/x-date-pickers'

createRoot(document.getElementById('root')).render(<StrictMode>
  <LocalizationProvider dateAdapter={AdapterDayjs} localeText={zhCN.components.MuiLocalizationProvider.defaultProps.localeText}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={5} anchorOrigin={{horizontal:'right',vertical:'bottom'}} transitionDuration={{enter:150,exit:150}} autoHideDuration={1500}>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </ThemeProvider>
  </LocalizationProvider>
</StrictMode>)

const setup = document.getElementById('setup')
if(setup !== null) {
  setup.remove()
}

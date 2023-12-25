import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './style.js'
import { theme } from './theme.js'

import { ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { SnackbarProvider } from 'notistack'
import router from './router.jsx'

createRoot(document.getElementById('root')).render(<StrictMode>
  <ThemeProvider theme={theme}>
    <SnackbarProvider maxSnack={5} anchorOrigin={{horizontal:'right',vertical:'bottom'}} transitionDuration={{enter:150,exit:150}} autoHideDuration={3000}>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </ThemeProvider>
</StrictMode>)

const setup = document.getElementById('setup')
if(setup !== null) {
  setup.remove()
}

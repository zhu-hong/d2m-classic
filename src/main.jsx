import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './style.js'
import { theme } from './theme.js'

import { ThemeProvider } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.jsx'

createRoot(document.getElementById('root')).render(<StrictMode>
  <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
  </ThemeProvider>
</StrictMode>)

import { createHashRouter } from 'react-router-dom'
import { Setup } from './pages/setup.jsx'

export const router = createHashRouter([
  {
    index: true,
    element: <Setup />,
  },
])

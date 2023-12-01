import { createHashRouter } from 'react-router-dom'
import { Setup } from './pages/setup.jsx'
import { ChooseToWork } from './pages/chooseWork.jsx'
import { OperatePage } from './pages/op/index.jsx'

export const router = createHashRouter([
  {
    path: '/',
    element: <Setup />,
  },
  {
    path: '/choose-work',
    element: <ChooseToWork />
  },
  {
    path: '/op',
    element: <OperatePage />
  },
])

import { createHashRouter } from 'react-router-dom'
import { SetupPage } from './pages/setup.jsx'
import { ChooseToWorkPage } from './pages/chooseWork.jsx'
import { OperatePage } from './pages/op/index.jsx'
import { TaskPage } from './pages/op/task.jsx'
import { ProcessPage } from './pages/op/process.jsx'

export const router = createHashRouter([
  {
    path: '/',
    element: <SetupPage />,
  },
  {
    path: '/choose-work',
    element: <ChooseToWorkPage />,
  },
  {
    path: '/op',
    element: <OperatePage />,
    children: [
      {
        index: true,
        element: <TaskPage />
      },
      {
        path: 'process',
        element: <ProcessPage />
      },
    ],
  },
])

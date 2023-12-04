import { createHashRouter } from 'react-router-dom'
import SetupPage from './pages/setup.jsx'
import OperatePage from './pages/op/index.jsx'
import TaskPage from './pages/op/task.jsx'
import ProcessPage from './pages/op/process.jsx'
import LogPage from './pages/op/log.jsx'
import MachinePage from './pages/op/machine.jsx'
import AndonPage from './pages/op/andon.jsx'
import { lazy, Suspense } from 'react'

const ChooseToWorkPageLazy = lazy(() => import('./pages/chooseWork.jsx'))

export const router = createHashRouter([
  {
    path: '/',
    element: <SetupPage />,
  },
  {
    path: '/choose-work',
    element: <Suspense><ChooseToWorkPageLazy /></Suspense>,
  },
  {
    path: '/op',
    element:<Suspense><OperatePage /></Suspense>,
    children: [
      {
        index: true,
        element:<Suspense><TaskPage /></Suspense>,
      },
      {
        path: 'process',
        element:<Suspense><ProcessPage /></Suspense>,
      },
      {
        path: 'machine',
        element:<Suspense><MachinePage /></Suspense>,
      },
      {
        path: 'log',
        element:<Suspense><LogPage /></Suspense>,
      },
      {
        path: 'andon',
        element: <Suspense><AndonPage /></Suspense>,
      },
    ],
  },
])

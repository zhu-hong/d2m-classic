import { createHashRouter } from 'react-router-dom'
import SetupPage from './pages/setup.jsx'
import { lazy, Suspense } from 'react'
import Loading from './components/loading.jsx'

const ChooseToWorkPageLazy = lazy(() => import('./pages/chooseWork.jsx'))
const OperatePageLazy = lazy(() => import('./pages/op/index.jsx'))
const TaskPageLazy = lazy(() => import('./pages/op/task.jsx'))
const ProcessPageLazy = lazy(() => import('./pages/op/process.jsx'))
const LogPageLazy = lazy(() => import('./pages/op/log.jsx'))
const MachinePageLazy = lazy(() => import('./pages/op/machine.jsx'))
const AndonPageLazy = lazy(() => import('./pages/op/andon.jsx'))

const withLazy = (component) => <Suspense fallback={<Loading />}>{component}</Suspense>

export default createHashRouter([
  {
    path: '/',
    element: <SetupPage />,
  },
  {
    path: '/choose-work',
    element: withLazy(<ChooseToWorkPageLazy />),
  },
  {
    path: '/op',
    element: withLazy(<OperatePageLazy />),
    children: [
      {
        index: true,
        element: withLazy(<TaskPageLazy />),
      },
      {
        path: 'process',
        element: withLazy(<ProcessPageLazy />),
      },
      {
        path: 'machine',
        element: withLazy(<MachinePageLazy />),
      },
      {
        path: 'log',
        element: withLazy(<LogPageLazy />),
      },
      {
        path: 'andon',
        element:  withLazy(<AndonPageLazy />),
      },
    ],
  },
])

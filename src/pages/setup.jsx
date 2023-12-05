import { Footer } from '@/components/footer.jsx'
import { Header } from '@/components/header.jsx'

import { 
  Box,
  Button,
} from '@mui/material'
import { enqueueSnackbar } from 'notistack'

import { useConfigStore } from '@/store.jsx'
import { ConfigDialog } from '@/components/configDialog.jsx'
import { useRef } from 'react'

const SetupPage = () => {
  const { config, setConfig } = useConfigStore()
  const configDialogRef = useRef()

  const openConfig = () => {
    configDialogRef.current.open()
  }

  const onEnterSystem = () => {
    if(!validationConfig()) {
      configDialogRef.current.open()
      return
    }
  }

  const validationConfig = () => {
    if(config.book === '') {
      enqueueSnackbar('请配置帐套', {
        variant: 'warning',
      })
      return false
    }
    if(config.workshopGuid === '') {
      enqueueSnackbar('请配置区域', {
        variant: 'warning',
      })
      return false
    }
    if(config.machineGuid === '') {
      enqueueSnackbar('请配置一体机', {
        variant: 'warning',
      })
      return false
    }
    return true
  }

  const onConfirmSuccess = (config) => {
    setConfig(config)
    enqueueSnackbar('配置成功', {
      variant: 'success',
    })
  }

  return <Box component='main' className='h-full flex flex-col'>
    <Header actions={[
      <Button key='action-mini' className="w-64px h-64px">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="4"><path fill="#FFF" fillRule="evenodd" d="M.667.667v2.666h26.666V.667H.667Z"/></svg>
      </Button>,
      <Button key='action-close' className="w-64px h-64px" variant="contained">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0Z"/><path fill="#FFF" fillRule="nonzero" d="M9.068 4.53a1.333 1.333 0 0 1-.266 1.867A11.978 11.978 0 0 0 4 16c0 6.627 5.373 12 12 12s12-5.373 12-12c0-3.823-1.799-7.345-4.798-9.6a1.333 1.333 0 1 1 1.602-2.131A14.644 14.644 0 0 1 30.667 16c0 8.1-6.567 14.667-14.667 14.667S1.333 24.1 1.333 16c0-4.673 2.202-8.983 5.868-11.735a1.333 1.333 0 0 1 1.867.265m7.265-3.197a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1h-.666a1 1 0 0 1-1-1V2.333a1 1 0 0 1 1-1h.666Z"/></g></svg>
      </Button>,
    ]} />
    <Box className="flex-auto bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center text-white" style={{ backgroundImage: 'url(./banner.png)' }}>
      <h1 className='text-44px leading-65px font-medium mb-24px'>欢迎使用 D2M Classic 管理系统</h1>
      <h3 className='text-24px leading-36px font-medium mb-84px'>WELCOME TO D2M Classic SYSTEM</h3>
      <Box>
        <Button onClick={openConfig} className='w-217px h-72px' style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '0' }}><span className='text-white text-3xl font-medium'>系统配置</span></Button>
        <Button onClick={onEnterSystem} className='w-217px h-72px' style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '0', marginLeft: '120px' }}><span className='text-white text-3xl font-medium'>进入系统</span></Button>

        <ConfigDialog ref={configDialogRef} onConfirmSuccess={onConfirmSuccess} />
      </Box>
    </Box>
    <Footer />
  </Box>
}

export default SetupPage

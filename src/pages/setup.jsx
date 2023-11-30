import { Footer } from '@/components/footer.jsx'
import { Header } from '@/components/header.jsx'

import { 
  Box,
  Button,
} from '@mui/material'
import { enqueueSnackbar } from 'notistack'

import { useConfigStore } from '@/store.jsx'
import { useEffect } from 'react'
import { ConfigDialog } from '@/components/configDialog.jsx'
import { useRef } from 'react'

export const Setup = () => {
  const { config, setConfig } = useConfigStore()
  const configDialogRef = useRef()

  useEffect(() => {
    const setup = document.getElementById('setup')
    if(setup !== null) {
      setup.remove()
    }
  }, [])

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
    if(config.account === '') {
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
    <Header />
    <Box className="flex-auto bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center text-white" style={{ backgroundImage: 'url(./banner.png)' }}>
      <h1 className='text-44px leading-65px font-medium mb-24px'>欢迎使用D2M Classic 管理系统</h1>
      <h3 className='text-24px leading-36px font-medium mb-84px'>WELCOME TO D2M Classic SYSTEM</h3>
      <Box>
        <Button onClick={openConfig} className='w-217px h-72px' style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '0' }} size='large'><span className='text-white text-3xl font-medium'>系统配置</span></Button>
        <Button onClick={onEnterSystem} className='w-217px h-72px' style={{ backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '0', marginLeft: '120px' }} size='large'><span className='text-white text-3xl font-medium'>进入系统</span></Button>

        <ConfigDialog ref={configDialogRef} onConfirmSuccess={onConfirmSuccess} />
      </Box>
    </Box>
    <Footer />
  </Box>
}

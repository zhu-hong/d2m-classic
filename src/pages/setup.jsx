import { Footer } from '@/components/footer.jsx'
import { Header } from '@/components/header.jsx'

import { 
  Box,
  Button,
  ButtonBase,
  CircularProgress,
} from '@mui/material'
import { enqueueSnackbar } from 'notistack'

import { useConfigStore } from '@/store.jsx'
import { ConfigDialog } from '@/components/configDialog.jsx'
import { useRef } from 'react'
import { useState } from 'react'
import { useApi } from '@/hook.js'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const SetupPage = () => {
  const { config, setConfig, setWorkcenters, setWorkstations } = useConfigStore()

  const [btnLoading, setBtnLoading] = useState(false)

  const api = useApi(config.serveUrl)
  const navigate = useNavigate()

  const onEnterSystem = () => {
    if(!validationConfig()) {
      setOpen(true)
      return
    }

    setBtnLoading(true)

    api().GetMachineDetail({
      MachineGuid: config.MachineGuid,
    }).then((res) => {
      if(res.code === 0) {
        const { Workcenters, Workstations } = res
        setWorkcenters(Workcenters)
        setWorkstations(Workstations)

        if(config.terminalType === 0) {
          if(Workcenters.length === 1) {
            setConfig({
              terminalInfo: Workcenters[0],
            })
            setWorkstations(Workstations.filter((w) => w.WorkcenterGuid === Workcenters[0].WorkcenterGuid))
            enqueueSnackbar('系统加载中，请稍后', {
              variant: 'success',
            })
            navigate('/op')
          } else if(Workcenters.length !== 0) {
            enqueueSnackbar('系统加载中，请稍后', {
              variant: 'success',
            })
            navigate('/choose-work')
          } else {
            enqueueSnackbar('未配置工作中心，请联系管理员', { variant: 'warning' })
          }
        } else {
          if(Workstations.length === 1) {
            enqueueSnackbar('系统加载中，请稍后', {
              variant: 'success',
            })
            setConfig({
              terminalInfo: Workstations[0],
            })
            setWorkstations(Workstations.filter((w) => w.WorkcenterGuid === Workstations[0].WorkcenterGuid))
            navigate('/op/process')
          } else if(Workstations.length !== 0) {
            enqueueSnackbar('系统加载中，请稍后', {
              variant: 'success',
            })
            navigate('/choose-work')
          } else {
            enqueueSnackbar('未配置工位，请联系管理员', { variant: 'warning' })
          }
        }
      }
    }).finally(() => setBtnLoading(false))
  }

  const validationConfig = () => {
    if(config.serveUrl === ''||config.WorkshopGuid === ''||config.MachineGuid === '') {
      enqueueSnackbar('请先完成系统配置', {
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

  useEffect(() => {
    let config = localStorage.getItem('config')
    if(config !== null) {
      config = JSON.parse(config)
      setConfig({
        ...config,
        terminalType: Number(config.terminalType)
      })
    }
  }, [])

  const [open, setOpen] = useState(false)

  return <Box component='main' className='h-full flex flex-col'>
    <Header actions={[
      <Button onClick={async () => {
        if(cefSharp) {
          await cefSharp.bindObjectAsync("hostWindow");
          hostWindow.minimize();
        }
      }} key='action-mini' className="w-64px h-64px">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="4"><path fill="#FFF" fillRule="evenodd" d="M.667.667v2.666h26.666V.667H.667Z"/></svg>
      </Button>,
      <Button onClick={async () => {
        if(cefSharp) {
          await cefSharp.bindObjectAsync("host");
          host.exit();
        }
      }} key='action-close' className="w-64px h-64px" variant="contained">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0Z"/><path fill="#FFF" fillRule="nonzero" d="M9.068 4.53a1.333 1.333 0 0 1-.266 1.867A11.978 11.978 0 0 0 4 16c0 6.627 5.373 12 12 12s12-5.373 12-12c0-3.823-1.799-7.345-4.798-9.6a1.333 1.333 0 1 1 1.602-2.131A14.644 14.644 0 0 1 30.667 16c0 8.1-6.567 14.667-14.667 14.667S1.333 24.1 1.333 16c0-4.673 2.202-8.983 5.868-11.735a1.333 1.333 0 0 1 1.867.265m7.265-3.197a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1h-.666a1 1 0 0 1-1-1V2.333a1 1 0 0 1 1-1h.666Z"/></g></svg>
      </Button>,
    ]} />
    <Box className="flex-auto bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center text-white" style={{ backgroundImage: 'url(./banner.png)' }}>
      <h1 className='text-44px leading-65px font-medium mb-24px'>欢迎使用 D2M Classic 管理系统</h1>
      <h3 className='text-24px leading-36px font-medium mb-84px'>WELCOME TO D2M Classic SYSTEM</h3>
      <Box>
        <ButtonBase disabled={btnLoading} onClick={() => setOpen(true)} className='w-217px h-72px' sx={{ backgroundColor: 'rgba(255,255,255,0.3)' }}><span className={['text-3xl font-medium', btnLoading?'opacity-50':''].join(' ')}>系统配置</span></ButtonBase>
        <ButtonBase disabled={btnLoading} onClick={onEnterSystem} className='w-217px h-72px text-white' sx={{ backgroundColor: 'rgba(255,255,255,0.3)', marginLeft: '120px' }}>
          <span className={['text-3xl font-medium', btnLoading?'opacity-50':''].join(' ')}>进入系统</span>
          {
            btnLoading?<CircularProgress size={30} color='inherit' className='ml-4' />:null
          }
        </ButtonBase>

        {
          open
          ?
          <ConfigDialog open={open} onClose={() => setOpen(false)}  onConfirmSuccess={onConfirmSuccess} />
          :
          null
        }
      </Box>
    </Box>
    <Footer />
  </Box>
}

export default SetupPage

import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { delay } from "@/utils.js"
import { Close } from "@mui/icons-material"
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, LinearProgress } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const TaskVerification = ({ open, onClose, task }) => {
  const [disableStart, setDisableStart] = useState(true)
  const [verifyProgress, setVerifyProgress] = useState(0)
  /**
   * 1 成功
   * 0 失败
   */
  const [verifyState, setVerifyState] = useState(1)
  const [verifyItems, setVerifyItems] = useState([
    {
      key: 'equipment',
      text: '设备调机校验',
      state: 2,
    },
    {
      key: 'mro',
      text: 'MRO校验',
      state: 2,
    },
    {
      key: 'processParameter',
      text: '工艺参数校验',
      state: 2,
    },
    {
      key: 'subProcess',
      text: '子工序校验',
      state: 2,
    },
  ])

  const navigate = useNavigate()

  const { config } = useConfigStore()

  const api = useApi(config.serveUrl)

  useEffect(() => {
    verifyTask()
  }, [])

  const verifyTask = () => {
    api().StartTaskValidate({
      taskGuid: task.taskGuid,
      workcenterGuid: config.terminalInfo.workcenterGuid,
    }).then(async ({ data }) => {
      let verifySuccess = true
      for(let key in data) {
        await delay(2000)
        const index = verifyItems.findIndex((d) => d.key === key)
        const target = verifyItems.splice(index, 1)[0]
        target.state = data[key]
        verifyItems.splice(index,0,target)
        setVerifyProgress((p) => p+100/Object.keys(data).length)
        setVerifyItems([...verifyItems])
        if(data[key] === 0) {
          setVerifyState(0)
          verifySuccess = false
        }
      }
      setDisableStart(!verifySuccess)
    }).catch(() => {
      setVerifyProgress(100)
      setVerifyState(0)
      enqueueSnackbar('验证失败，请稍后再试', { variant: 'error' })
    })
  }
  
  /**
   * @todo
   */
  const onEntryProcess = () => {
    api().StartTask({
      workcenterGuid: config.terminalInfo.workcenterGuid,
      schedulingGuid: '',
      taskGuid: task.taskGuid,
    }).then(() => navigate('/process'))
  }

  return <Dialog open={open} maxWidth='1064px' scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>开启任务验证</p>
      <IconButton onClick={onClose}><Close /></IconButton>
    </DialogTitle>
    {
      task === null
      ?
      null
      :
      <DialogContent className='w-1064px h-716px flex'>
        <Box className='py-32px w-256px'>
          <Box className='flex justify-between'>
            <Box>
              <h1 className="text-[#000C25] text-xl">{task.productName}</h1>
              <p className="text-[#646A73] text-xs mt-8px">{task.productCode}</p>
            </Box>
            <img src="https://res.d2mcloud.com/common/logo.png" className="w-80px h-80px object-cover" />
          </Box>
          <Divider sx={{margin:'9px 0 15px'}} />
          <Box className='flex mb-8px text-[#646A73]'>
            <span className="flex-1">任务编号</span>
            <span className="flex-1">订单编号</span>
          </Box>
          <Box className='flex mb-16px text-[#000c25]'>
            <span className="flex-1">{task.taskCode}</span>
            <span className="flex-1">{task.orderCode}</span>
          </Box>
          <Box className='flex mb-8px text-[#646A73]'>
            <span className="flex-1">计划开始</span>
            <span className="flex-1">计划结束</span>
          </Box>
          <Box className='flex mb-16px text-[#000c25]'>
            <span className="flex-1">{task.planStartTime}</span>
            <span className="flex-1">{task.planEndTime}</span>
          </Box>
          <Box className='flex mb-8px text-[#646A73]'>
            <span className="flex-1">计划数量(psc)</span>
          </Box>
          <Box className='flex mb-16px text-4xl'>
            <span className="text-[#000c25] flex-1">{task.planAmount}</span>
          </Box>
        </Box>
        <Divider orientation="vertical" sx={{margin:'0 32px'}} />
        <Box className='flex-auto flex flex-col justify-between'>
          <Box className='w-full py-32px'>
            <LinearProgress color={['error','primary'][verifyState]} variant="determinate" value={verifyProgress} size={40} className="rounded" sx={{height:'10px'}} />
              {
                verifyState === 0
                ?
                <Box className='text-[#F04848] text-2xl font-medium my-12px'>验证失败</Box>
                :
                <Box className='text-[#044244] text-2xl font-medium my-12px'>{verifyProgress >= 100 ? '验证完成' : `正在验证 ${verifyProgress}%…`}</Box>
              }
          </Box>
          {
            verifyItems.map((v) => {
              return <div key={v.key} className="mt-10px flex justify-between items-center">
                <span>{v.text}</span>
                <span className="flex-auto"></span>
                {
                  [
                    <>
                      <span className="text-[#F04848] mr-8px">验证失败</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#F04848" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12L17 15.59z"></path></svg>
                    </>,
                    <>
                      <span className="text-[#058373] mr-8px">验证完成</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="#058373" d="m10.6 16.6l7.05-7.05l-1.4-1.4l-5.65 5.65l-2.85-2.85l-1.4 1.4l4.25 4.25ZM12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Z"></path></svg>
                    </>,
                    <>
                      <span className="text-[#8F959E] mr-8px">正在验证</span>
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><defs><linearGradient id="mingcuteLoadingFill0" x1="50%" x2="50%" y1="5.271%" y2="91.793%"><stop offset="0%" stopColor="#058373"></stop><stop offset="100%" stopColor="#058373" stopOpacity=".55"></stop></linearGradient><linearGradient id="mingcuteLoadingFill1" x1="50%" x2="50%" y1="15.24%" y2="87.15%"><stop offset="0%" stopColor="#058373" stopOpacity="0"></stop><stop offset="100%" stopColor="#058373" stopOpacity=".55"></stop></linearGradient></defs><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"></path><path fill="url(#mingcuteLoadingFill0)" d="M8.749.021a1.5 1.5 0 0 1 .497 2.958A7.502 7.502 0 0 0 3 10.375a7.5 7.5 0 0 0 7.5 7.5v3c-5.799 0-10.5-4.7-10.5-10.5C0 5.23 3.726.865 8.749.021Z" transform="translate(1.5 1.625)"></path><path fill="url(#mingcuteLoadingFill1)" d="M15.392 2.673a1.5 1.5 0 0 1 2.119-.115A10.475 10.475 0 0 1 21 10.375c0 5.8-4.701 10.5-10.5 10.5v-3a7.5 7.5 0 0 0 5.007-13.084a1.5 1.5 0 0 1-.115-2.118Z" transform="translate(1.5 1.625)"></path></g></svg>
                    </>,
                  ][v.state]
                }
              </div>
            })
          }
          <div className="flex-auto"></div>
          <Button disabled={disableStart} onClick={onEntryProcess} variant="contained" size="large" className="self-end w-200px h-56px"><Box className='text-2xl'>进入加工</Box></Button>
        </Box>
      </DialogContent>
    }
  </Dialog>
}

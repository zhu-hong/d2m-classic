import { TaskVerification } from "@/components/taskVerificationDialog.jsx"
import { AttendanceDialog } from "@/components/attendanceDialog.jsx"
import { ArrowForwardIos } from "@mui/icons-material"
import { PlayCircleOutline } from "@mui/icons-material"
import { ArrowBackIosNew } from "@mui/icons-material"
import { Box, Button, Divider, Grid, Paper, Skeleton } from "@mui/material"
import { useRef } from "react"
import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { useEffect } from "react"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const TaskPage = () => {
  const attendanceDialogRef = useRef()
  const verificationDialogRef = useRef()

  const { config } = useConfigStore()

  const operateMachine = () => {
    verificationDialogRef.current.open()
  }

  const api = useApi(config.serveUrl)
  const [centerInfo, setCenterInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api().GetWorkcenterProductionInformation({
      WorkcenterGuid: config.terminalInfo.workcenterGuid,
    }).then((res) => {
      setCenterInfo(res.data)
    }).catch(() => {
      enqueueSnackbar('获取任务错误，请稍后重试', {
        variant: 'error',
      })
    })
  }, [])

  const navigate = useNavigate()
  const onChangeWork = (e) => {
    e.preventDefault()
    navigate('/choose-work')
  }

  return <Grid container spacing={2}>
    {
      loading
      ?
      <>
        <Grid item xs={3}>
        <Skeleton variant="rectangular" height={480} />
        </Grid>
         <Grid item xs={3}>
          <Skeleton variant="rectangular" height={480} />
         </Grid>
         <Grid item xs={3}>
          <Skeleton variant="rectangular" height={480} />
         </Grid>
         <Grid item xs={3}>
          <Skeleton variant="rectangular" height={480} />
         </Grid>
         <Grid item xs={3}>
          <Skeleton variant="rectangular" height={480} />
         </Grid>
         <Grid item xs={3}>
          <Skeleton variant="rectangular" height={480} />
         </Grid>
         <Grid item xs={3}>
          <Skeleton variant="rectangular" height={480} />
         </Grid>
         <Grid item xs={3}>
          <Skeleton variant="rectangular" height={480} />
         </Grid>
      </>
      :
      <>
        <Grid item xs={12}>
          <Paper className="w-full py-24px pl-16px pr-24px flex items-center justify-between" onClick={() => attendanceDialogRef.current.open()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#000c25" fillRule="nonzero" d="M12 .5a4 4 0 0 1 3.995 3.8l.001.03a10.002 10.002 0 0 1 5.896 10.646l-.01-.006a4 4 0 1 1-4.237 6.764l.015.01-.096.066A9.953 9.953 0 0 1 12 23.5c-2.1 0-4.05-.648-5.66-1.755l.097-.073a4 4 0 1 1-4.302-6.711l-.027.014A10.002 10.002 0 0 1 8.003 4.33l-.002.084L8 4.5a4 4 0 0 1 4-4M8.417 6.28l.026.052a8 8 0 0 0-4.38 8.17L4.03 14.5H4a4 4 0 0 1 3.628 5.686l-.005.011A7.961 7.961 0 0 0 12 21.5c1.616 0 3.12-.479 4.377-1.303l-.005-.01a4 4 0 0 1 3.429-5.681l.199-.006-.062.002a8 8 0 0 0-4.382-8.17l-.011.023a4 4 0 0 1-7.128-.075M20 16.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-16 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8-14a2 2 0 1 0 0 4 2 2 0 0 0 0-4" /></svg>
            <span className="text-[#000c25] ml-8px mr-16px text-2xl font-medium">外球笼1线</span>
            <Button variant="outlined" size="small" className="h-32px" onClick={onChangeWork}>切换</Button>
            <Box className='flex-auto'></Box>
            <Box className='mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">当前班次：</span>白班</Box>
            <Box className='mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">班次时间：</span>11/01  9:00～11/01 16:00</Box>
            <Box className='text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">在岗人员：</span>4人</Box>
          </Paper>

          <AttendanceDialog ref={attendanceDialogRef} />

          <TaskVerification ref={verificationDialogRef} />
        </Grid>
        <Grid item xs={3}>
          <Paper>
            <Box className='bg-[#FF9900] w-full h-4px'></Box>
            <Box className='p-12px text-[#000c25] flex justify-between items-center'>
              <span className="text-lg">序号：</span>
              <span className="text-xl">1</span>
              <Box className='flex-auto'></Box>
              <Button size="small" color="primary" variant="text"><ArrowBackIosNew fontSize="24" />前移</Button>
              <Button size="small" color="primary" variant="text">后移<ArrowForwardIos fontSize="24" /></Button>
            </Box>
            <Divider />
            <Box className='p-12px'>
              <Box className='flex items-center justify-between'>
                <Box>
                  <Box className='text-[#000c25] text-lg mb-8px'>外球笼</Box>
                  <Box className='text-[#646A73] text-xs mb-8px'>11-1008P-01</Box>
                  <Button size="small" color="warning" style={{backgroundColor:'#FFEBCC'}}>进行中</Button>
                </Box>
                <img className="w-80px h-80px object-cover" src="https://res.d2mcloud.com/common/logo.svg" />
              </Box>
              <Divider style={{marginTop:12}} />
            </Box>
            <Box className='p-12px'>
              <Box className='flex mb-8px text-[#646A73]'>
                <span className="flex-1">任务编号</span>
                <span className="flex-1">订单编号</span>
              </Box>
              <Box className='flex mb-16px text-[#000c25]'>
                <span className="flex-1">RW23102890</span>
                <span className="flex-1">DD23102090</span>
              </Box>
              <Box className='flex mb-8px text-[#646A73]'>
                <span className="flex-1">计划开始</span>
                <span className="flex-1">计划结束</span>
              </Box>
              <Box className='flex mb-16px text-[#000c25]'>
                <span className="flex-1">23/10/28 09:00</span>
                <span className="flex-1">23/11/10 09:00</span>
              </Box>
              <Box className='flex mb-8px text-[#646A73]'>
                <span className="flex-1">完工数量</span>
                <span className="flex-1">计划数量</span>
              </Box>
              <Box className='flex mb-16px text-3xl'>
                <span className="text-[#058373] flex-1">90</span>
                <span className="text-[#000c25] flex-1">105</span>
              </Box>
              <Button color="error" variant="outlined" className="w-full h-48px">
                <svg className="w-20px h-20px" xmlns="http://www.w3.org/2000/svg" viewBox='0 0 32 32'><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0Z"/><path fill="#F04848" fillRule="nonzero" d="M9.068 4.53a1.333 1.333 0 0 1-.266 1.867A11.978 11.978 0 0 0 4 16c0 6.627 5.373 12 12 12s12-5.373 12-12c0-3.823-1.799-7.345-4.798-9.6a1.333 1.333 0 1 1 1.602-2.131A14.644 14.644 0 0 1 30.667 16c0 8.1-6.567 14.667-14.667 14.667S1.333 24.1 1.333 16c0-4.673 2.202-8.983 5.868-11.735a1.333 1.333 0 0 1 1.867.265m7.265-3.197a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1h-.666a1 1 0 0 1-1-1V2.333a1 1 0 0 1 1-1h.666Z"/></g></svg>
                <span className="text-lg ml-8px">关闭</span>
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>
            <Box className='bg-[#F04848] w-full h-4px'></Box>
            <Box className='p-12px text-[#000c25] flex justify-between items-center'>
              <span className="text-lg">序号：</span>
              <span className="text-xl">1</span>
              <Box className='flex-auto'></Box>
              <Button size="small" color="primary" variant="text"><ArrowBackIosNew fontSize="24" />前移</Button>
              <Button size="small" color="primary" variant="text">后移<ArrowForwardIos fontSize="24" /></Button>
            </Box>
            <Divider />
            <Box className='p-12px'>
              <Box className='flex items-center justify-between'>
                <Box>
                  <Box className='text-[#000c25] text-lg mb-8px'>外球笼</Box>
                  <Box className='text-[#646A73] text-xs mb-8px'>11-1008P-01</Box>
                  <Button size="small" color="error" style={{backgroundColor:'#FCDADA'}}>未开始</Button>
                </Box>
                <img className="w-80px h-80px object-cover" src="https://res.d2mcloud.com/common/logo.svg" />
              </Box>
              <Divider style={{marginTop:12}} />
            </Box>
            <Box className='p-12px'>
              <Box className='flex mb-8px text-[#646A73]'>
                <span className="flex-1">任务编号</span>
                <span className="flex-1">订单编号</span>
              </Box>
              <Box className='flex mb-16px text-[#000c25]'>
                <span className="flex-1">RW23102890</span>
                <span className="flex-1">DD23102090</span>
              </Box>
              <Box className='flex mb-8px text-[#646A73]'>
                <span className="flex-1">计划开始</span>
                <span className="flex-1">计划结束</span>
              </Box>
              <Box className='flex mb-16px text-[#000c25]'>
                <span className="flex-1">23/10/28 09:00</span>
                <span className="flex-1">23/11/10 09:00</span>
              </Box>
              <Box className='flex mb-8px text-[#646A73]'>
                <span className="flex-1">完工数量</span>
                <span className="flex-1">计划数量</span>
              </Box>
              <Box className='flex mb-16px text-3xl'>
                <span className="text-[#058373] flex-1">90</span>
                <span className="text-[#000c25] flex-1">105</span>
              </Box>
              <Button variant="contained" className="w-full h-48px" onClick={() => operateMachine()}>
                <PlayCircleOutline />
                <span className="text-lg ml-8px">开始</span>
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper>
            <Box className='bg-[#646A73] w-full h-4px'></Box>
            <Box className='p-12px text-[#000c25] flex justify-between items-center'>
              <span className="text-lg">序号：</span>
              <span className="text-xl">1</span>
              <Box className='flex-auto'></Box>
              <Button size="small" color="primary" variant="text"><ArrowBackIosNew fontSize="24" />前移</Button>
              <Button size="small" color="primary" variant="text">后移<ArrowForwardIos fontSize="24" /></Button>
            </Box>
            <Divider />
            <Box className='p-12px'>
              <Box className='flex items-center justify-between'>
                <Box>
                  <Box className='text-[#000c25] text-lg mb-8px'>外球笼</Box>
                  <Box className='text-[#646A73] text-xs mb-8px'>11-1008P-01</Box>
                  <Button size="small" color="info" style={{backgroundColor:'#E0E1E3'}}>已关闭</Button>
                </Box>
                <img className="w-80px h-80px object-cover" src="https://res.d2mcloud.com/common/logo.svg" />
              </Box>
              <Divider style={{marginTop:12}} />
            </Box>
            <Box className='p-12px'>
              <Box className='flex mb-8px text-[#646A73]'>
                <span className="flex-1">任务编号</span>
                <span className="flex-1">订单编号</span>
              </Box>
              <Box className='flex mb-16px text-[#000c25]'>
                <span className="flex-1">RW23102890</span>
                <span className="flex-1">DD23102090</span>
              </Box>
              <Box className='flex mb-8px text-[#646A73]'>
                <span className="flex-1">计划开始</span>
                <span className="flex-1">计划结束</span>
              </Box>
              <Box className='flex mb-16px text-[#000c25]'>
                <span className="flex-1">23/10/28 09:00</span>
                <span className="flex-1">23/11/10 09:00</span>
              </Box>
              <Box className='flex mb-8px text-[#646A73]'>
                <span className="flex-1">完工数量</span>
                <span className="flex-1">计划数量</span>
              </Box>
              <Box className='flex mb-16px text-3xl'>
                <span className="text-[#058373] flex-1">90</span>
                <span className="text-[#000c25] flex-1">105</span>
              </Box>
              <Button variant="contained" className="w-full h-48px">
                <PlayCircleOutline />
                <span className="text-lg ml-8px">开始</span>
              </Button>
            </Box>
          </Paper>
        </Grid>
      </>
    }
  </Grid>
}

export default TaskPage

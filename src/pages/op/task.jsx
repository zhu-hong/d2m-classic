import { TaskVerification } from "@/components/taskVerificationDialog.jsx"
import { AttendanceDialog } from "@/components/attendanceDialog.jsx"
import { PlayCircleOutline } from "@mui/icons-material"
import { Box, Button, Divider, Grid, Paper, Skeleton } from "@mui/material"
import { useRef } from "react"
import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import dayjs from "dayjs"

const TaskPage = () => {
  const attendanceDialogRef = useRef()

  const { config,workcenters, workstations } = useConfigStore()

  const api = useApi(config.serveUrl)
  const [centerInfo, setCenterInfo] = useState(null)
  const [openVerify, setOpenVerify] = useState(false)
  const [curTask, setCurTask] = useState(null)

  useEffect(() => {
    getCenterInfo()

    const t = setInterval(() => {
      getCenterInfo()
    }, 3000)

    return () => clearInterval(t)
  }, [])

  const getCenterInfo = () => {
    api().GetWorkcenterProductionInformation({
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
      MachineGuid: config.MachineGuid,
    }).then((res) => {
      if(res.code === 0) {
        setCenterInfo(res.data)
      }
    })
  }

  const navigate = useNavigate()
  const onChangeWork = (e) => {
    e.preventDefault()
    navigate('/choose-work?to='+encodeURIComponent('/op'))
  }

  const onAttendance = () => {
    attendanceDialogRef.current.open()
  }

  /**
   * @todo
   */
  const onOperateTask = (task) => {
    setCurTask(task)

    if(['未开始','已结束'].includes(task.State)) {
      setOpenVerify(true)
      return
    }

    api().CloseTask({
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
      TaskGuid: task.TaskGuid,
    }).then((res) => {
      if(res.code === 0) {
        getCenterInfo()
      }
    })
  }

  return <div className="w-full flex flex-col overflow-auto">
    {
      centerInfo === null
      ?
      null
      :
      <>
        <Paper className="w-full flex-none py-24px mb-12px pl-16px pr-24px flex items-center justify-between" onClick={() => onAttendance()}>
          <svg className="flex-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#000c25" fillRule="nonzero" d="M12 .5a4 4 0 0 1 3.995 3.8l.001.03a10.002 10.002 0 0 1 5.896 10.646l-.01-.006a4 4 0 1 1-4.237 6.764l.015.01-.096.066A9.953 9.953 0 0 1 12 23.5c-2.1 0-4.05-.648-5.66-1.755l.097-.073a4 4 0 1 1-4.302-6.711l-.027.014A10.002 10.002 0 0 1 8.003 4.33l-.002.084L8 4.5a4 4 0 0 1 4-4M8.417 6.28l.026.052a8 8 0 0 0-4.38 8.17L4.03 14.5H4a4 4 0 0 1 3.628 5.686l-.005.011A7.961 7.961 0 0 0 12 21.5c1.616 0 3.12-.479 4.377-1.303l-.005-.01a4 4 0 0 1 3.429-5.681l.199-.006-.062.002a8 8 0 0 0-4.382-8.17l-.011.023a4 4 0 0 1-7.128-.075M20 16.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-16 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8-14a2 2 0 1 0 0 4 2 2 0 0 0 0-4" /></svg>
          <span className="text-[#000c25] ml-8px mr-16px text-2xl font-medium truncate">{config.terminalInfo.WorkcenterName}</span>
          {
            [workcenters.length>1,workstations.length>1][config.terminalType]
            ?
            <Button variant="outlined" size="small" className="h-32px" onClick={onChangeWork}>切换</Button>
            :
            null
          }
          <Box className='flex-auto min-w-10'></Box>
          {
            centerInfo.ShiftName === ''
            ?
              <Box className='flex-none text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">暂无班次</span></Box>
            :
            <>
              <Box className='flex-none mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">当前班次：</span>{centerInfo.ShiftName}</Box>
              <Box className='flex-none mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">班次时间：</span>{dayjs(centerInfo.ShiftStartTime).format('MM/DD HH:mm')} ～ {dayjs(centerInfo.ShiftEndTime).format('MM/DD HH:mm')}</Box>
              <Box className='flex-none text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">在岗人员：</span>{centerInfo.Amount}人</Box>
            </>
          }

        </Paper>
        <AttendanceDialog ref={attendanceDialogRef} workcenter={centerInfo} onConfirm={getCenterInfo} />
      </>
    }
    <div className="flex-auto">
      {
        (centerInfo === null || centerInfo.Tasks.length > 0)
        ?
        <Grid container spacing={2}>
          {
            centerInfo === null
            ?
            <>
              <Grid item xs={3}><Skeleton variant="rectangular" height={480} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={480} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={480} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={480} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={480} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={480} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={480} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={480} /></Grid>
            </>
            :
            <>
              {
                centerInfo.Tasks.map((t, index) => {
                  return <Grid item xs={3} key={t.TaskGuid}>
                    <Paper className="h-full flex flex-col">
                      {
                        t.State === '生产中'
                        ?
                        <Box className='bg-[#FF9900] w-full h-4px'></Box>
                        :
                        t.State === '未开始'
                        ?
                        <Box className='bg-[#F04848] w-full h-4px'></Box>
                        :
                        <Box className='bg-[#646A73] w-full h-4px'></Box>
                      }
                      <Box className='p-12px text-[#000c25] flex justify-between items-center'>
                        <span className="text-lg">序号：</span>
                        <span className="text-xl">{index+1}</span>
                        <Box className='flex-auto'></Box>
                        {/* {
                          centerInfo.Tasks.length <= 1
                          ?
                          null
                          :
                          <>
                            {
                              index === 0
                              ?
                              <Button size="small" color="primary" variant="text">后移<ArrowForwardIos fontSize="24" /></Button>
                              :
                              index === (centerInfo.Tasks.length - 1)
                              ?
                              <Button size="small" color="primary" variant="text"><ArrowBackIosNew fontSize="24" />前移</Button>
                              :
                              <>
                                <Button size="small" color="primary" variant="text"><ArrowBackIosNew fontSize="24" />前移</Button>
                                <Button size="small" color="primary" variant="text">后移<ArrowForwardIos fontSize="24" /></Button>
                              </>
                            }
                          </>
                        } */}
                      </Box>
                      <Divider />
                      <Box className='p-12px'>
                        <Box className='flex items-center justify-between'>
                          <Box>
                            <Box className='text-[#000c25] text-lg mb-8px'>{t.ProductName}</Box>
                            <Box className='text-[#646A73] text-xs mb-8px'>{t.ProductCode}</Box>
                            {
                              t.State === '生产中'
                              ?
                              <Button size="small" color="warning" style={{backgroundColor:'#FFEBCC'}}>生产中</Button>
                              :
                              t.State === '未开始'
                              ?
                              <Button size="small" color="error" style={{backgroundColor:'#FCDADA'}}>未开始</Button>
                              :
                              <Button size="small" color="info" style={{backgroundColor:'#E0E1E3'}}>已关闭</Button>
                            }
                          </Box>
                          {/* <img className="w-80px h-80px object-cover" src="https://res.d2mcloud.com/common/logo.svg" /> */}
                        </Box>
                        <Divider style={{marginTop:12}} />
                      </Box>
                      <Box className='p-12px flex-auto flex flex-col'>
                        <Box className='flex mb-8px text-[#646A73]'>
                          <span className="flex-1">任务编号</span>
                          <span className="flex-1 ml-4">订单编号</span>
                        </Box>
                        <Box className='flex mb-16px text-[#000c25]'>
                          <span className="flex-1" style={{lineBreak:'anywhere'}}>{t.TaskCode}</span>
                          <span className="flex-1 ml-4" style={{lineBreak:'anywhere'}}>{t.OrderCode}</span>
                        </Box>
                        <Box className='flex mb-8px text-[#646A73]'>
                          <span className="flex-1">计划开始</span>
                          <span className="flex-1 ml-4">计划结束</span>
                        </Box>
                        <Box className='flex mb-16px text-[#000c25]'>
                          <span className="flex-1">{dayjs(t.PlanStartTime).format('MM/DD HH:mm')}</span>
                          <span className="flex-1 ml-4">{dayjs(t.PlanEndTime).format('MM/DD HH:mm')}</span>
                        </Box>
                        <Box className='flex mb-8px text-[#646A73]'>
                          <span className="flex-1">计划数量</span>
                          <span className="flex-1 ml-4">完工数量</span>
                        </Box>
                        <Box className='flex mb-16px text-3xl'>
                          <span className="text-[#058373] flex-1">{t.PlanAmount}</span>
                          <span className="text-[#000c25] flex-1 ml-4">{t.CompletedAmount}</span>
                        </Box>
                        <div className="flex-auto"></div>
                        {
                          t.State === '生产中'
                          ?
                          <Button color="error" variant="outlined" className="w-full h-48px" onClick={() => onOperateTask(t)}>
                            <svg className="w-20px h-20px" xmlns="http://www.w3.org/2000/svg" viewBox='0 0 32 32'><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0Z"/><path fill="#F04848" fillRule="nonzero" d="M9.068 4.53a1.333 1.333 0 0 1-.266 1.867A11.978 11.978 0 0 0 4 16c0 6.627 5.373 12 12 12s12-5.373 12-12c0-3.823-1.799-7.345-4.798-9.6a1.333 1.333 0 1 1 1.602-2.131A14.644 14.644 0 0 1 30.667 16c0 8.1-6.567 14.667-14.667 14.667S1.333 24.1 1.333 16c0-4.673 2.202-8.983 5.868-11.735a1.333 1.333 0 0 1 1.867.265m7.265-3.197a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1h-.666a1 1 0 0 1-1-1V2.333a1 1 0 0 1 1-1h.666Z"/></g></svg>
                            <span className="text-lg ml-8px">关闭</span>
                          </Button>
                          :
                          t.State === '未开始'
                          ?
                          <Button variant="contained" className="w-full h-48px" onClick={() => onOperateTask(t)}>
                            <PlayCircleOutline />
                            <span className="text-lg ml-8px">开始</span>
                          </Button>
                          :
                          <Button variant="contained" className="w-full h-48px">
                            <PlayCircleOutline />
                            <span className="text-lg ml-8px">开始</span>
                          </Button>
                        }
                      </Box>
                    </Paper>
                  </Grid>
                })
              }
              {
                openVerify
                ?
                <TaskVerification open={openVerify} onClose={() => setOpenVerify(false)} task={curTask} />
                :
                null
              }
            </>
          }
        </Grid>
        :
        <div className="w-full h-full bg-white flex flex-col justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="195" height="146"><g fill="none" fillRule="evenodd"><path fill="#EEF1F5" d="M97.077 109.211c50.263 0 91.009 5.433 91.009 12.135 0 6.701-40.746 12.134-91.01 12.134-50.262 0-91.009-5.433-91.009-12.134 0-6.702 40.747-12.135 91.01-12.135"/><path fill="#DFE3E9" d="M75.234 21.842v4.068a2 2 0 0 0 2 2h.854a2 2 0 0 0 2-2v-4.068H94.65v4.068a2 2 0 0 0 1.85 1.994l.15.006h.854a2 2 0 0 0 2-2v-4.068h14.56l.001 4.068a2 2 0 0 0 1.85 1.994l.15.006h.854a2 2 0 0 0 2-2v-4.068h14.202a4 4 0 0 1 4 4v89.077a4 4 0 0 1-4 4H61.033a4 4 0 0 1-4-4V25.842a4 4 0 0 1 4-4h14.2"/><path fill="#8F959E" d="M57.033 94.65h80.088v20.269a4 4 0 0 1-4 4H61.033a4 4 0 0 1-4-4v-20.27"/><g fillRule="nonzero" transform="translate(65.527 36.404)"><rect width="63.1" height="21.842" fill="#FFF" rx="2"/><g transform="translate(7.28 3.64)"><circle cx="7.281" cy="7.281" r="7.281" fill="#FFD200"/><path fill="#FFF" d="M9.355 4.342a1.193 1.193 0 0 1 1.972 1.333l-.084.124-3.85 4.986c-.464.6-1.35.613-1.836.063l-.092-.118-1.852-2.702A1.193 1.193 0 0 1 5.488 6.56l.092.118.926 1.352 2.849-3.69"/><rect width="28.935" height="3.206" x="20.057" y="2.745" fill="#DFE3E9" rx="1.344"/><rect width="18.132" height="3.206" x="20.057" y="9.157" fill="#DFE3E9" rx="1.344"/></g></g><g fillRule="nonzero" transform="translate(65.527 64.313)"><rect width="63.1" height="21.842" fill="#FFF" rx="2"/><g transform="translate(7.28 3.64)"><circle cx="7.281" cy="7.281" r="7.281" fill="#FFD200"/><path fill="#FFF" d="M9.355 4.342a1.193 1.193 0 0 1 1.972 1.333l-.084.124-3.85 4.986c-.464.6-1.35.613-1.836.063l-.092-.118-1.852-2.702A1.193 1.193 0 0 1 5.488 6.56l.092.118.926 1.352 2.849-3.69"/><rect width="28.935" height="3.206" x="20.057" y="2.745" fill="#DFE3E9" rx="1.344"/><rect width="18.132" height="3.206" x="20.057" y="9.157" fill="#DFE3E9" rx="1.344"/></g></g><path fill="#FFD500" d="M33.821 108.68s-6.845-1.77-8.338-7.802c0 0 10.614-2.03 10.92 8.333l-2.582-.53"/><path fill="#FFD500" d="M33.511 107.986s-4.067-6.894-.487-13.336c0 0 6.86 4.667 3.813 13.348l-3.326-.012"/><path fill="#FFD500" d="M35.19 109.192s2.38-8.147 9.578-9.688c0 0 1.35 5.315-4.657 9.707l-4.92-.02"/><path fill="#8F959E" d="m30.336 107.998 1.327 9.667 8.36.04 1.235-9.661z"/><path fill="#000" fillOpacity=".1" d="M150.316 68.03c-7.42-10.428-21.952-12.913-32.46-5.55-10.509 7.367-13.01 21.79-5.59 32.217 6.428 9.03 18.19 12.102 28.05 7.978l4.512 6.34a2.085 2.085 0 0 0-.218 2.679l13.151 18.473a2.123 2.123 0 0 0 2.944.502l4.645-3.257a2.086 2.086 0 0 0 .507-2.92l-13.151-18.474a2.122 2.122 0 0 0-2.601-.698l-4.228-5.937c9.53-7.582 11.58-21.318 4.44-31.354m-27.995.726c7.016-4.917 16.72-3.26 21.674 3.702 4.955 6.962 3.284 16.592-3.731 21.51-7.015 4.916-16.718 3.258-21.673-3.702-4.955-6.964-3.285-16.593 3.73-21.51"/><g fill="#CECECE"><path d="M121.99 79.83a.754.754 0 0 0-.329-.223 1.161 1.161 0 0 0-.39-.071.83.83 0 0 0-.224 0 .9.9 0 0 0-.214.076.514.514 0 0 0-.165.142.385.385 0 0 0 .083.54l.005.004c.118.08.247.142.384.185l.5.153c.175.048.342.12.498.212.154.094.285.22.384.37.112.19.165.407.154.626a1.362 1.362 0 0 1-.521 1.11c-.164.125-.35.217-.548.273-.217.056-.44.086-.664.087a2.476 2.476 0 0 1-.818-.13 2.14 2.14 0 0 1-.696-.431l.702-.772a1.104 1.104 0 0 0 1.114.397.866.866 0 0 0 .218-.087.504.504 0 0 0 .16-.142.384.384 0 0 0 .06-.212.368.368 0 0 0-.154-.316 1.513 1.513 0 0 0-.389-.201l-.51-.164a2.314 2.314 0 0 1-.51-.218 1.3 1.3 0 0 1-.39-.364 1.047 1.047 0 0 1-.153-.599 1.332 1.332 0 0 1 .521-1.089c.164-.124.35-.216.548-.272.209-.06.425-.092.642-.092.251 0 .5.037.74.108.238.072.458.195.643.36l-.68.74M125.391 81.327a.542.542 0 0 0-.159-.408.552.552 0 0 0-.428-.175.75.75 0 0 0-.483.18.546.546 0 0 0-.137.185.745.745 0 0 0-.054.218h1.261m.823 1.35a1.55 1.55 0 0 1-.576.447 1.8 1.8 0 0 1-.73.158c-.227 0-.454-.038-.668-.115a1.594 1.594 0 0 1-.549-.327 1.427 1.427 0 0 1-.368-.506 1.73 1.73 0 0 1 0-1.323 1.47 1.47 0 0 1 .368-.506c.158-.144.345-.256.549-.326a1.96 1.96 0 0 1 .669-.115c.207-.003.412.036.603.115.175.07.332.183.455.326.13.148.23.32.291.506.07.215.105.439.104.664v.294h-2.194a.74.74 0 0 0 .253.43c.129.111.295.169.465.164a.72.72 0 0 0 .4-.104 1.08 1.08 0 0 0 .28-.267l.648.485M128.639 81.86h-.27a1.24 1.24 0 0 0-.312.055.644.644 0 0 0-.252.13.3.3 0 0 0-.105.246.272.272 0 0 0 .149.255.589.589 0 0 0 .302.082.86.86 0 0 0 .268-.038.847.847 0 0 0 .236-.109.495.495 0 0 0 .22-.43v-.202l-.236.012m.236.958a.862.862 0 0 1-.423.354 1.47 1.47 0 0 1-.971.05.92.92 0 0 1-.598-.478 1.027 1.027 0 0 1 0-.856.888.888 0 0 1 .27-.305c.117-.081.246-.143.383-.185.147-.045.297-.078.45-.098.153-.02.306-.034.46-.039h.429a.483.483 0 0 0-.181-.396.637.637 0 0 0-.428-.153.933.933 0 0 0-.428.098c-.133.066-.25.16-.346.272l-.51-.517c.179-.168.392-.294.625-.37.237-.083.485-.125.735-.125.235-.006.469.03.692.103a1 1 0 0 1 .427.305c.114.146.192.315.23.495.042.225.062.452.061.68v1.558h-.877v-.393M130.328 80.14h.955v.49c.087-.166.21-.311.362-.424a.948.948 0 0 1 .548-.142h.165l.154.027v.866a1.33 1.33 0 0 0-.198-.05 1.347 1.347 0 0 0-.208 0 1.072 1.072 0 0 0-.434.077.55.55 0 0 0-.241.212.724.724 0 0 0-.115.327c-.01.138-.01.276 0 .413v1.28h-.988V80.14M134.914 81.158a.577.577 0 0 0-.472-.234.75.75 0 0 0-.549.212.905.905 0 0 0 0 1.128c.146.142.345.219.549.211a.494.494 0 0 0 .274-.07.718.718 0 0 0 .198-.163l.625.658a1.248 1.248 0 0 1-.521.316 1.935 1.935 0 0 1-1.245-.022 1.648 1.648 0 0 1-.549-.326 1.477 1.477 0 0 1-.362-.507 1.624 1.624 0 0 1 .362-1.829 1.64 1.64 0 0 1 .549-.326 1.935 1.935 0 0 1 1.245-.022c.198.06.377.17.52.316l-.624.658M136.839 78.437v2.122a.542.542 0 0 1 .11-.179.86.86 0 0 1 .18-.158c.082-.048.169-.086.259-.114.101-.03.206-.044.312-.044.203-.008.404.03.587.114a.813.813 0 0 1 .346.305c.087.14.145.295.17.458.029.19.044.383.044.577v1.687h-.955v-1.502a2.282 2.282 0 0 0 0-.272.82.82 0 0 0-.054-.262.448.448 0 0 0-.149-.196.46.46 0 0 0-.28-.076.617.617 0 0 0-.3.065.447.447 0 0 0-.17.18.593.593 0 0 0-.083.245 2.666 2.666 0 0 0 0 .294v1.524h-.955v-4.768h.938"/></g><path fill="#8F959E" d="m146.657 94.642-5.273 3.697 6.805 9.56 5.273-3.698z"/><path fill="#FFD500" d="M147.543 106.345a2.086 2.086 0 0 0-.506 2.922l13.15 18.473a2.123 2.123 0 0 0 2.945.502l4.645-3.257a2.086 2.086 0 0 0 .507-2.92l-13.151-18.474a2.122 2.122 0 0 0-2.943-.503l-4.647 3.257M142.69 91.54c7.016-4.917 8.687-14.547 3.732-21.509-4.954-6.962-14.658-8.62-21.674-3.702-7.015 4.917-8.685 14.546-3.73 21.508v.002c4.955 6.96 14.658 8.618 21.673 3.701m-22.408-31.486c10.507-7.364 25.04-4.88 32.46 5.548 7.42 10.429 4.917 24.851-5.591 32.214-10.507 7.364-25.038 4.88-32.459-5.546-7.42-10.427-4.919-24.85 5.588-32.215a.007.007 0 0 0 .002-.001"/><path fill="#FFF" d="M133.722 63.505c-8.588 0-15.55 6.91-15.55 15.433s6.962 15.433 15.55 15.433c8.589 0 15.551-6.91 15.551-15.433s-6.962-15.433-15.55-15.433"/><path fill="#DFE3E9" fillRule="nonzero" d="M135.303 82.515v-.322c0-.551.12-1.034.358-1.493.215-.414.525-.805.954-1.15 1.144-.965 1.836-1.585 2.05-1.815.573-.736.883-1.678.883-2.827 0-1.402-.477-2.505-1.431-3.31-.954-.827-2.218-1.217-3.768-1.217-1.764 0-3.147.482-4.172 1.447-1.05.966-1.55 2.299-1.55 4h2.718c0-.966.19-1.724.596-2.253.453-.643 1.192-.942 2.242-.942.81 0 1.454.207 1.907.643.43.437.668 1.035.668 1.793 0 .575-.215 1.126-.644 1.632l-.286.321c-1.55 1.333-2.48 2.299-2.79 2.92-.334.62-.477 1.378-.477 2.251v.322h2.742m-1.228 4.854a1.784 1.784 0 0 0 1.832-1.832c0-.53-.188-.965-.516-1.302-.353-.338-.799-.506-1.316-.506-.516 0-.939.168-1.291.506-.353.337-.517.771-.517 1.302 0 .53.164.964.517 1.302.352.337.775.53 1.291.53"/></g></svg>
          <span className="text-[#8F959E]">暂无任务</span>
        </div>
      }
    </div>
  </div>
}

export default TaskPage

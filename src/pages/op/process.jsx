import { AttendanceDialog } from "@/components/attendanceDialog.jsx";
import { ColorButton } from "@/components/ccolorButton.jsx";
import { Docs } from "@/components/docsDialog.jsx";
import { JobNumDialog } from "@/components/jobNumDialog.jsx";
import { ProcessReport } from "@/components/processReportDialog.jsx";
import { StationsDialog } from "@/components/stationsDialog.jsx";
import { useApi } from "@/hook.js";
import { useConfigStore } from "@/store.jsx"
import { Box, Button, Divider, Skeleton, ToggleButtonGroup } from "@mui/material"
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";

const ProcessPage = () => {
  const { config, workcenters, workstations } = useConfigStore()
  const [tabType, setTabType] = useState(0)
  const [centerInfo, setCenterInfo] = useState(null)
  const [taskInfo, setTaskInfo] = useState(null)
  const [openDoc, setOpenDoc] = useState(false)
  const [openStations, setOpenStations] = useState(false)
  const [taskId, setTaskId] = useState('')
  /**
   * 0 启动
   * 1 暂停
   */
  const [stationMode, setStationMode] = useState(0)

  const [isStart, setIsStart] = useState(false)

  const [reportOpen, setReportOpen] = useState(false)

  const [isNoTask, setIsNoTask] = useState(false)

  const attendanceDialogRef = useRef()

  const [defaultDoc, setDefaultDoc] = useState(null)

  const api = useApi(config.serveUrl)

  const [jobNumOpen, setJobNumOpen] = useState(false)

  useEffect(() => {
    initTask()
  }, [])

  const initTask = () => {
    api().GetWorkcenterProductionInformation({
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
      MachineGuid: config.MachineGuid,
    }).then((res) => {
      if(res.code === 0) {
        setCenterInfo(res.data)
        
        const target = res.data.Tasks.find((t) => t.State === '生产中')
        if(target !== undefined) {
          setTaskId(target.TaskGuid)
          getTaskInfo(target.TaskGuid)
        } else {
          setIsNoTask(true)
        }
      }
    }).catch(() => {
      enqueueSnackbar('获取任务错误，请稍后重试', {
        variant: 'error',
      })
      setIsNoTask(true)
    })
  }

  useEffect(() => {
    if(taskInfo === null) return

    getDefaultDoc()
  }, [taskInfo])

  const getTaskInfo = (TaskGuid) => {
    api().GetTaskInformation({
      TaskGuid,
      MachineGuid: config.MachineGuid,
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
    }).then((res) => {
      if(res.code === 0) {
        const stations = res.data.Workstations
        if(config.terminalType === 1) {
          // 工位级
          const target = stations.find((s) => s.WorkstationGuid === config.terminalInfo.WorkstationGuid)
          if(target !== undefined) {
            setIsStart(target.State === '生产中')
          }
        } else {
          const target = stations[0]
          if(target !== undefined) {
            setIsStart(target.State === '生产中')
          }
        }
        setTaskInfo(res.data)
      }
    })
  }

  const getDefaultDoc = () => {
    // api().GetDefaultDocumentContent({
    //   ProdstdaGuid: taskInfo.ProdstdaGuid,
    //   ProductGuid: taskInfo.ProductCode,
    //   ProductVersion: taskInfo.ProductVersion,
    // }).then((res) => {
    //   if(res.code === 0) {
    //     setDefaultDoc(res.data)
    //   }
    // })
  }

  const onCloseTask = () => {
    api().CloseTask({
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
      TaskGuid: taskId,
    }).then((res) => {
      if(res.code === 0) {
        enqueueSnackbar("任务关闭成功", { variant: 'success' })
        initTask()
      }
    })
  }

  /**
   * @todo
   */
  const applyStopProcess = () => {
    if(config.terminalType === 1) {
      stopProcess(config.terminalInfo.WorkstationGuid)
    } else {
      // setStationMode(1)
      // setOpenStations(true)
      stopProcess('')
    }
  }

  const stopProcess = (WorkstationGuid) => {
    setOpenStations(false)
    api().WorkstationClose({
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
      WorkstationGuid,
      TaskGuid: taskId,
      MachineGuid: config.MachineGuid,
    }).then((res) => {
      if(res.code === 0) {
        enqueueSnackbar("生产暂停成功", { variant: 'success' })
        getTaskInfo(taskId)
      }
    })
  }

  /**
   * @todo
  */
  const applyStartProcess = () => {
    if(config.terminalType === 1) {
      validationStartProcess(config.terminalInfo.WorkstationGuid)
    } else {
      // setStationMode(0)
      // setOpenStations(true)
      validationStartProcess('')
    }
  }

  /**
   * @todo
   */
  const validationStartProcess = (WorkstationGuid) => {
    api().WorkstationStartValidate({
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
      WorkstationGuid,
      TaskGuid: taskId,
      MachineGuid: config.MachineGuid,
    }).then((res) => {
      if(res.code === 0) {
        let success = true
        Object.keys(res.data).forEach((key) => {
          if(res.data[key] === 0) {
            success = false
          }
        })
        if(success === false) {
          enqueueSnackbar('启动生产验证失败', { variant: 'error' })
          return
        }

        api().WorkstationStart({
          MachineGuid: config.MachineGuid,
          TaskGuid: taskId,
          WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
          WorkstationGuid,
        }).then((res) => {
          if(res.code === 0) {
            enqueueSnackbar("生产启动成功", { variant: 'success' })
            getTaskInfo(taskId)
          }
        })
      }
    })
  }

  const stationConfirm = (WorkstationGuid) => {
    setOpenStations(false)
    if(stationMode === 0) {
      validationStartProcess(WorkstationGuid)
    } else {
      stopProcess(WorkstationGuid)
    }
  }

  const navigate = useNavigate()

  const onApplyReport = () => {
    
  }

  const [reportValidateInfo, setReportValidateInfo] = useState(null)
  const onJobNumConfirm = (jobNum) => {
    setJobNumOpen(false)
    api().WorkstationReportValidate({
      Code: jobNum,
      MachineGuid: config.MachineGuid,
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
    }).then((res) => {
      if(res.code === 0) {
        setReportValidateInfo(res.data)
        setReportOpen(true)
      }
    })
  }

  return <Box className='w-full h-full flex flex-col'>
    {
      isNoTask
      ?
      <div className="w-full h-full bg-white flex items-center justify-center text-lg text-[#000C25]">暂无生产任务，请等待任务开启或联系相关人员</div>
      :
      <>
        {
          centerInfo === null
          ?
          <Skeleton variant="rectangular" height={32} />
          :
          <Box>
            <Box className="w-full pl-16px pr-24px flex items-center justify-between" onClick={() => attendanceDialogRef.current.open()}>
              {
                [
                  <svg className="flex-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M12 .5a4 4 0 0 1 3.995 3.8l.001.03a10.002 10.002 0 0 1 5.896 10.646l-.01-.006a4 4 0 1 1-4.237 6.764l.015.01-.096.066A9.953 9.953 0 0 1 12 23.5c-2.1 0-4.05-.648-5.66-1.755l.097-.073a4 4 0 1 1-4.302-6.711l-.027.014A10.002 10.002 0 0 1 8.003 4.33l-.002.084L8 4.5a4 4 0 0 1 4-4M8.417 6.28l.026.052a8 8 0 0 0-4.38 8.17L4.03 14.5H4a4 4 0 0 1 3.628 5.686l-.005.011A7.961 7.961 0 0 0 12 21.5c1.616 0 3.12-.479 4.377-1.303l-.005-.01a4 4 0 0 1 3.429-5.681l.199-.006-.062.002a8 8 0 0 0-4.382-8.17l-.011.023a4 4 0 0 1-7.128-.075M20 16.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-16 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8-14a2 2 0 1 0 0 4 2 2 0 0 0 0-4" /></svg>,
                  <svg className="flex-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M14 1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4v1.014h6V9a1 1 0 0 1 2 0v1.014h1V7a1 1 0 0 1 2 0v3.014h.131a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5.05a2 2 0 0 1-2-2v-5.57H7.906v5.57a2 2 0 0 1-2 2H3.131a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2H8V9H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm7.131 11.015h-18v9h2.775v-7.57h10.175v7.57h5.05v-9M14 3H4v4h10z"/></svg>,
                ][config.terminalType]
              }
              <span className="text-[#000c25] ml-8px mr-16px text-2xl font-medium truncate">{config.terminalInfo[['WorkcenterName','WorkstationName'][config.terminalType]]}</span>
              {
                [workcenters.length>1,workstations.length>1][config.terminalType]
                ?
                <Button variant="outlined" size="small" className="h-32px" onClick={(e) => {
                  e.stopPropagation()
                  navigate('/choose-work')
                }}>切换</Button>
                :
                null
              }
              <Box className='flex-auto min-w-10'></Box>
              <Box className='flex-none mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">当前班次：</span>{centerInfo.ShiftName}</Box>
              <Box className='flex-none mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">班次时间：</span>{dayjs(centerInfo.ShiftStartTime).format('YY/MM/DD HH:mm')} ～ {dayjs(centerInfo.ShiftEndTime).format('YY/MM/DD HH:mm')}</Box>
              <Box className='flex-none text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">在岗人员：</span>{centerInfo.Amount}人</Box>
            </Box>

            <AttendanceDialog ref={attendanceDialogRef} workcenter={centerInfo} />
          </Box>
        }
        <Box className='flex-auto my-16px overflow-auto flex'>
          {
            taskInfo === null
            ?
            <div className="w-352px h-full mr-16px">
              <Skeleton variant="rectangular" sx={{width:'100%',height:'100%'}} />
            </div>
            :
            <>
              <Box className='w-352px bg-white mr-16px px-24px overflow-auto py-27px children:mb-16px'>
                <Box className='text-[#000C25] font-bold text-2xl'>任务编号：{taskInfo.TaskCode}</Box>
                <Box className='text-[#000C25] font-bold text-2xl'>产品编号：{taskInfo.ProductCode}</Box>
                <Box className='text-[#000C25] font-bold text-2xl'>产品名称：{taskInfo.ProductName}</Box>
                <Box className='text-[#000C25] font-bold text-2xl'>制程：{taskInfo.ProcessName}</Box>
                <Divider />
                <Box className='bg-[#E9E9E9] w-full h-25px rounded mt-16px overflow-hidden relative children:absolute'>
                  <Box className='h-full bg-[#F04848] rounded top-0 left-0' style={{width:(taskInfo.CompletedAmount+taskInfo.UnqualifiedAmount)/taskInfo.PlanAmount*100+'%'}}></Box>
                  <Box className='h-full bg-[#00C089] rounded top-0 left-0' style={{width:taskInfo.CompletedAmount/taskInfo.PlanAmount*100+'%'}}></Box>
                </Box>
                <Box className='flex mb-8px text-[#646A73]'>
                  <span className="flex-1">计划数量</span>
                  <span className="flex-1">实际数量</span>
                </Box>
                <Box className='flex text-28px font-bold mb-16px text-[#000c25]'>
                  <span className="flex-1">{taskInfo.PlanAmount}</span>
                  <span className="flex-1">{taskInfo.CompletedAmount}</span>
                </Box>
                <Box className='flex mb-8px text-[#646A73]'>
                  <span className="flex-1">计划开始</span>
                  <span className="flex-1">计划结束</span>
                </Box>
                <Box className='flex text-28px font-bold mb-16px text-[#000c25]'>
                  <span className="flex-1">{dayjs(taskInfo.PlanStartTime).format('YY/MM/DD')} <span className="text-xl">{dayjs(taskInfo.PlanStartTime).format('HH:mm')}</span></span>
                  <span className="flex-1">{dayjs(taskInfo.PlanEndTime).format('YY/MM/DD')} <span className="text-xl">{dayjs(taskInfo.PlanStartTime).format('HH:mm')}</span></span>
                </Box>
                <Box className='flex text-lg mb-8px text-[#646A73]'>
                  <span className="flex-1">合格数量</span>
                  <span className="flex-1">不合格数量</span>
                </Box>
                <Box className='flex text-3xl font-bold'>
                  <span className="text-[#058373] flex-1">{taskInfo.CompletedAmount}</span>
                  <span className="text-[#F04848] flex-1">{taskInfo.UnqualifiedAmount}</span>
                </Box>
              </Box>
            </>
          }
          <Box className='flex-auto overflow-auto bg-white p-16px flex flex-col'>
            <Box className='flex justify-between items-center'>
              <ToggleButtonGroup color="primary" value={tabType} size="large" sx={{border:'1px solid #CECECE'}}>
                <Button value={0} onClick={() => setTabType(0)} variant={tabType===0?'contained':''} className="w-120px"><span className="text-lg font-medium">操作流程</span></Button>
                {/* <Button value={1} onClick={() => setTabType(1)} variant={tabType===1?'contained':''} className="w-120px"><span className="text-lg font-medium">物料信息</span></Button> */}
              </ToggleButtonGroup>
              <Box className='flex-auto'></Box>
              {/* <Box className='text-lg text-[#000C25] mr-16px'>指导书文档名称.excl</Box> */}
            </Box>
            <Box className='flex-auto mt-8px' sx={{display:tabType===0?'block':'none'}}>文档</Box>
            {/* <Box className='flex-auto mt-8px' sx={{display:tabType===1?'flex':'none'}}>
              <Box className='w-512px overflow-auto text-[#000C25] border border-t border-l border-[#CECECE]'>
                <Box className='w-full bg-[#DFE8E9] text-center h-41px leading-41px border-b border-[#CECECE]'>原料</Box>
                <Box className='w-full overflow-auto bg-[#CDE6E3] children:py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
                  <Box sx={{width:'15%'}}>编号</Box>
                  <Box sx={{width:'25%'}}>名称</Box>
                  <Box sx={{width:'20%'}}>累计上料</Box>
                  <Box sx={{width:'20%'}}>已消耗量</Box>
                  <Box sx={{width:'20%'}}>欠料量</Box>
                </Box>
                <Box className='w-full bg-[#FFFFFF] children:py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
                  <Box sx={{width:'15%'}}>编号</Box>
                  <Box sx={{width:'25%'}}>名称</Box>
                  <Box sx={{width:'20%'}}>累计上料</Box>
                  <Box sx={{width:'20%'}}>已消耗量</Box>
                  <Box sx={{width:'20%'}}>欠料量</Box>
                </Box>
                <Box className='w-full bg-[#F2F9F8] children:py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
                  <Box sx={{width:'15%'}}>编号</Box>
                  <Box sx={{width:'25%'}}>名称</Box>
                  <Box sx={{width:'20%'}}>累计上料</Box>
                  <Box sx={{width:'20%'}}>已消耗量</Box>
                  <Box sx={{width:'20%'}}>欠料量</Box>
                </Box>
              </Box>
              <Box className='ml-16px flex-auto overflow-auto text-[#000C25] border border-t border-l border-[#CECECE]'>
                <Box className='w-full bg-[#DFE8E9] text-center h-41px leading-41px border-b border-r border-[#CECECE]'>原料</Box>
                <Box className='w-full overflow-auto bg-[#CDE6E3] children:py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
                  <Box sx={{width:'20%'}}>编号</Box>
                  <Box sx={{width:'50%'}}>名称</Box>
                  <Box sx={{width:'30%'}}>累计上料</Box>
                </Box>
                <Box className='w-full bg-[#FFFFFF] children:py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
                  <Box sx={{width:'20%'}}>编号</Box>
                  <Box sx={{width:'50%'}}>名称</Box>
                  <Box sx={{width:'30%'}}>累计上料</Box>
                </Box>
                <Box className='w-full bg-[#F2F9F8] children:py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
                  <Box sx={{width:'20%'}}>编号</Box>
                  <Box sx={{width:'50%'}}>名称</Box>
                  <Box sx={{width:'30%'}}>累计上料</Box>
                </Box>
              </Box>
            </Box> */}
          </Box>
        </Box>
        <Box className='h-98px bg-white py-13px px-16px flex justify-between items-center -mr-16px'>
          {
            taskInfo === null
            ?
            <div className="w-full h-full">
              <Skeleton variant="rectangular" height={72} />
            </div>
            :
            <>
              <ColorButton ccolor="#F74140" onClick={onCloseTask}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#FFF" fillRule="nonzero" d="M26.506 5.734A14.7 14.7 0 0 1 30.666 16c0 8.1-6.566 14.667-14.666 14.667C7.9 30.667 1.333 24.1 1.333 16c0-3.903 1.533-7.541 4.231-10.273a1.333 1.333 0 1 1 1.897 1.874C5.251 9.84 4 12.807 4 16c0 6.627 5.373 12 12 12s12-5.373 12-12c0-3.18-1.24-6.185-3.404-8.406a1.333 1.333 0 0 1 1.91-1.86m-9.173-4.4v16h-2.666v-16z"/></svg>
                <span className="ml-8px">关闭</span>
              </ColorButton>
              <Box className='flex-auto mr-16px'></Box>
              <ColorButton ccolor="#0080A4" sx={{width:'176px'}} onClick={() => attendanceDialogRef.current.open()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0z"/><path fill="#FFF" d="M9.333 1.333V4h13.334V1.333h2.666V4H28a2.657 2.657 0 0 1 2.667 2.667V28A2.657 2.657 0 0 1 28 30.667H4A2.657 2.657 0 0 1 1.333 28V6.667A2.657 2.657 0 0 1 4 4h2.667V1.333zM28 12H4v16h24zm-12 8v2.667H6.667V20zm9.333-5.333v2.666H6.667v-2.666zm2.667-8H4v2.666h24z"/></g></svg>
                <span className="ml-8px">签到/签退</span>
              </ColorButton>
              <>
                <ColorButton ccolor="#17A9C3" onClick={() => setOpenDoc(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><g fill="none" fillRule="evenodd"><path d="M0 0h32v32H0z"/><path fill="#FFF" fillRule="nonzero" d="M17.333 1.333c.014 0 .027 0 .04.014h.04c.12.013.24.04.347.066l.04.014.08.04c.147.066.28.16.4.266l8 8c.107.107.2.24.267.387.013.04.026.067.026.093l.014.04a.99.99 0 0 1 .066.334c0 .013 0 .026.014.04v9.578c2.179.577 3.881 2.521 3.998 4.887l.006.26a5.318 5.318 0 0 1-5.315 5.315H5.333A2.666 2.666 0 0 1 2.667 28V4c0-1.48 1.2-2.667 2.666-2.667zM16 4H5.333v24l5.062.001a4.31 4.31 0 0 1-.328-1.654c0-1.967 1.348-3.643 3.16-4.163l.04-.01.026-.106a6.818 6.818 0 0 1 6.273-5.021l.3-.007c1.534 0 2.976.51 4.136 1.396L24 12h-6.667C16.6 12 16 11.4 16 10.667zm3.867 15.707a4.146 4.146 0 0 0-4.125 3.764l-.11 1.213h-1.218c-.911 0-1.68.764-1.68 1.663 0 .914.739 1.653 1.653 1.653h10.969a2.651 2.651 0 0 0 2.648-2.649c0-1.581-1.476-2.853-3.04-2.627l-.953.138-.43-.86a4.146 4.146 0 0 0-3.714-2.295m-10.534-5.04a1.333 1.333 0 1 1 0 2.666H8a1.333 1.333 0 1 1 0-2.666zM12 9.333A1.333 1.333 0 1 1 12 12H8a1.333 1.333 0 0 1 0-2.667zm6.667-3.448V9.34h3.453z"/></g></svg>
                  <span className="ml-8px">文档</span>
                </ColorButton>
                
                {
                  openDoc
                  ?
                  <Docs open={openDoc} onClose={() => setOpenDoc(false)} task={taskInfo} />
                  :
                  null
                }
              </>
              {
                isStart
                ?
                <>
                  <ColorButton ccolor="#16AC99" onClick={() => setJobNumOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#FFF" fillRule="nonzero" d="M16 4c7.732 0 14 6.268 14 14s-6.268 14-14 14S2 25.732 2 18 8.268 4 16 4m0 2.667C9.74 6.667 4.667 11.74 4.667 18c0 6.26 5.074 11.333 11.333 11.333 6.26 0 11.333-5.074 11.333-11.333 0-6.26-5.074-11.333-11.333-11.333M17.333 10v9.333h-2.666V10zm9.724-5.495 2.829 2.828L28 9.22l-2.828-2.828zM10.667 0h10.666v2.667H10.667Z"/></svg>
                    <span className="ml-8px">报工</span>
                  </ColorButton>

                  <JobNumDialog open={jobNumOpen} onClose={() => setJobNumOpen(false)} onConfirm={onJobNumConfirm} />

                  {
                    reportOpen
                    ?
                    <ProcessReport open={reportOpen} onClose={() => setReportOpen(false)} task={taskInfo} validateInfo={reportValidateInfo} onConfirmReport={() => getTaskInfo(taskId)} />
                    :
                    null
                  }
                </>
                :
                null
              }
              {
                isStart
                ?
                <ColorButton ccolor="#058373" onClick={applyStopProcess}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#FFF" fillRule="evenodd" d="M16 1.333C24.1 1.333 30.667 7.9 30.667 16S24.1 30.667 16 30.667 1.333 24.1 1.333 16 7.9 1.333 16 1.333M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4m-1.719 6.335v12h-3.428v-12zm6.857 0v12H17.71v-12z"/></svg>
                  <span className="ml-8px">暂停</span>
                </ColorButton>
                :
                <ColorButton ccolor="#058373" onClick={applyStartProcess}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#FFF" fillRule="evenodd" d="M16 1.333C24.1 1.333 30.667 7.9 30.667 16S24.1 30.667 16 30.667 1.333 24.1 1.333 16 7.9 1.333 16 1.333M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4m-2.667 6 8 6-8 6z"/></svg>
                  <span className="ml-8px">启动</span>
                </ColorButton>
              }

              {
                openStations
                ?
                <StationsDialog onClose={() => setOpenStations(false)} open={openStations} onConfirm={stationConfirm} stations={taskInfo.Workstations} />
                :
                null
              }
            </>
          }
        </Box>
      </>
    }
  </Box>
}

export default ProcessPage
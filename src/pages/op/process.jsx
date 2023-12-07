import { AttendanceDialog } from "@/components/attendanceDialog.jsx";
import { ColorButton } from "@/components/ccolorButton.jsx";
import { Docs } from "@/components/docsDialog.jsx";
import { JobNumDialog } from "@/components/jobNumDialog.jsx";
import { ProcessReport } from "@/components/processReportDialog.jsx";
import { StationsDialog } from "@/components/stationsDialog.jsx";
import { useApi } from "@/hook.js";
import { useConfigStore } from "@/store.jsx"
import { Box, Button, CircularProgress, Divider, Skeleton, ToggleButtonGroup } from "@mui/material"
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

  const api = useApi(config.serveUrl)
  const docApi = useApi(config.serveUrl, { responseType: 'blob' })

  const [jobNumOpen, setJobNumOpen] = useState(false)

  const pdfContainer = useRef()
  const [docLoading, setDocLoading] = useState(true)
  const [blobUrl, setBlobUrl] = useState('')
  const [isNoDoc, setIsNoDoc] = useState(false)

  useEffect(() => {
    initTask()

    const t = setInterval(() => initTask(), 5000)

    return () => {
      if(blobUrl !== '') {
        URL.revokeObjectURL(blobUrl)
      }
      clearInterval(t)
    }
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
          getTaskInfo(target.TaskGuid)
          setIsNoTask(false)
          setTaskId(target.TaskGuid)
        } else {
          setIsNoTask(true)
          setTaskId('')
        }
      }
    })
  }

  useEffect(() => {
    if(taskInfo === null) return

    getDefaultDoc()
  }, [taskInfo.TaskGuid])

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
    if(blobUrl !== '') {
      URL.revokeObjectURL(blobUrl)
    }
    pdfContainer.current.innerHTML = ''
    setIsNoDoc(false)

    docApi().GetDefaultDocumentContent({
      ProdstdaGuid: taskInfo.ProdstdaGuid,
      ProductGuid: taskInfo.ProductCode,
      ProductVersion: taskInfo.ProductVersion,
    }).then((res) => {
      if(res.status === 204) {
        setDocLoading(false)
        setIsNoDoc(true)
        return
      }
      const bloburl = URL.createObjectURL(res)
      setBlobUrl(bloburl)
      const loadingTask = window.pdfjsLib.getDocument(bloburl)
      loadingTask.promise.then(async (pdf) => {
        for (let index = 1; index <= pdf.numPages; index++) {
          await pdf.getPage(index).then(async (page) => {
            const viewport = page.getViewport({scale: 2});

            // Prepare canvas using PDF page dimensions
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            const renderTask = page.render(renderContext);
            await renderTask.promise.then(() => {
              setDocLoading(false)
              pdfContainer.current.append(canvas)
            });
          })
        }
      })
    })
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
      centerInfo === null
      ?
      <Skeleton variant="rectangular" height={32} />
      :
      <>
        <Box className="w-full pl-16px pr-24px flex items-center justify-between mb-16px" onClick={() => attendanceDialogRef.current.open()}>
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
              navigate('/choose-work?to='+encodeURIComponent('/op/process'))
            }}>切换</Button>
            :
            null
          }
          <Box className='flex-auto min-w-10'></Box>
          <Box className='flex-none mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">当前班次：</span>{centerInfo.ShiftName}</Box>
          <Box className='flex-none mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">班次时间：</span>{dayjs(centerInfo.ShiftStartTime).format('MM/DD HH:mm')} ～ {dayjs(centerInfo.ShiftEndTime).format('MM/DD HH:mm')}</Box>
          <Box className='flex-none text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">在岗人员：</span>{centerInfo.Amount}人</Box>
        </Box>

        <AttendanceDialog ref={attendanceDialogRef} workcenter={centerInfo} />
      </>
    }
    {
      isNoTask
      ?
      <div className="w-full h-full bg-white flex items-center justify-center flex-col">
        <svg xmlns="http://www.w3.org/2000/svg" width="195" height="146"><g fill="none" fillRule="evenodd"><path fill="#EEF1F5" d="M97.077 109.211c50.263 0 91.009 5.433 91.009 12.135 0 6.701-40.746 12.134-91.01 12.134-50.262 0-91.009-5.433-91.009-12.134 0-6.702 40.747-12.135 91.01-12.135"/><path fill="#DFE3E9" d="M75.234 21.842v4.068a2 2 0 0 0 2 2h.854a2 2 0 0 0 2-2v-4.068H94.65v4.068a2 2 0 0 0 1.85 1.994l.15.006h.854a2 2 0 0 0 2-2v-4.068h14.56l.001 4.068a2 2 0 0 0 1.85 1.994l.15.006h.854a2 2 0 0 0 2-2v-4.068h14.202a4 4 0 0 1 4 4v89.077a4 4 0 0 1-4 4H61.033a4 4 0 0 1-4-4V25.842a4 4 0 0 1 4-4h14.2"/><path fill="#8F959E" d="M57.033 94.65h80.088v20.269a4 4 0 0 1-4 4H61.033a4 4 0 0 1-4-4v-20.27"/><g fillRule="nonzero" transform="translate(65.527 36.404)"><rect width="63.1" height="21.842" fill="#FFF" rx="2"/><g transform="translate(7.28 3.64)"><circle cx="7.281" cy="7.281" r="7.281" fill="#FFD200"/><path fill="#FFF" d="M9.355 4.342a1.193 1.193 0 0 1 1.972 1.333l-.084.124-3.85 4.986c-.464.6-1.35.613-1.836.063l-.092-.118-1.852-2.702A1.193 1.193 0 0 1 5.488 6.56l.092.118.926 1.352 2.849-3.69"/><rect width="28.935" height="3.206" x="20.057" y="2.745" fill="#DFE3E9" rx="1.344"/><rect width="18.132" height="3.206" x="20.057" y="9.157" fill="#DFE3E9" rx="1.344"/></g></g><g fillRule="nonzero" transform="translate(65.527 64.313)"><rect width="63.1" height="21.842" fill="#FFF" rx="2"/><g transform="translate(7.28 3.64)"><circle cx="7.281" cy="7.281" r="7.281" fill="#FFD200"/><path fill="#FFF" d="M9.355 4.342a1.193 1.193 0 0 1 1.972 1.333l-.084.124-3.85 4.986c-.464.6-1.35.613-1.836.063l-.092-.118-1.852-2.702A1.193 1.193 0 0 1 5.488 6.56l.092.118.926 1.352 2.849-3.69"/><rect width="28.935" height="3.206" x="20.057" y="2.745" fill="#DFE3E9" rx="1.344"/><rect width="18.132" height="3.206" x="20.057" y="9.157" fill="#DFE3E9" rx="1.344"/></g></g><path fill="#FFD500" d="M33.821 108.68s-6.845-1.77-8.338-7.802c0 0 10.614-2.03 10.92 8.333l-2.582-.53"/><path fill="#FFD500" d="M33.511 107.986s-4.067-6.894-.487-13.336c0 0 6.86 4.667 3.813 13.348l-3.326-.012"/><path fill="#FFD500" d="M35.19 109.192s2.38-8.147 9.578-9.688c0 0 1.35 5.315-4.657 9.707l-4.92-.02"/><path fill="#8F959E" d="m30.336 107.998 1.327 9.667 8.36.04 1.235-9.661z"/><path fill="#000" fillOpacity=".1" d="M150.316 68.03c-7.42-10.428-21.952-12.913-32.46-5.55-10.509 7.367-13.01 21.79-5.59 32.217 6.428 9.03 18.19 12.102 28.05 7.978l4.512 6.34a2.085 2.085 0 0 0-.218 2.679l13.151 18.473a2.123 2.123 0 0 0 2.944.502l4.645-3.257a2.086 2.086 0 0 0 .507-2.92l-13.151-18.474a2.122 2.122 0 0 0-2.601-.698l-4.228-5.937c9.53-7.582 11.58-21.318 4.44-31.354m-27.995.726c7.016-4.917 16.72-3.26 21.674 3.702 4.955 6.962 3.284 16.592-3.731 21.51-7.015 4.916-16.718 3.258-21.673-3.702-4.955-6.964-3.285-16.593 3.73-21.51"/><g fill="#CECECE"><path d="M121.99 79.83a.754.754 0 0 0-.329-.223 1.161 1.161 0 0 0-.39-.071.83.83 0 0 0-.224 0 .9.9 0 0 0-.214.076.514.514 0 0 0-.165.142.385.385 0 0 0 .083.54l.005.004c.118.08.247.142.384.185l.5.153c.175.048.342.12.498.212.154.094.285.22.384.37.112.19.165.407.154.626a1.362 1.362 0 0 1-.521 1.11c-.164.125-.35.217-.548.273-.217.056-.44.086-.664.087a2.476 2.476 0 0 1-.818-.13 2.14 2.14 0 0 1-.696-.431l.702-.772a1.104 1.104 0 0 0 1.114.397.866.866 0 0 0 .218-.087.504.504 0 0 0 .16-.142.384.384 0 0 0 .06-.212.368.368 0 0 0-.154-.316 1.513 1.513 0 0 0-.389-.201l-.51-.164a2.314 2.314 0 0 1-.51-.218 1.3 1.3 0 0 1-.39-.364 1.047 1.047 0 0 1-.153-.599 1.332 1.332 0 0 1 .521-1.089c.164-.124.35-.216.548-.272.209-.06.425-.092.642-.092.251 0 .5.037.74.108.238.072.458.195.643.36l-.68.74M125.391 81.327a.542.542 0 0 0-.159-.408.552.552 0 0 0-.428-.175.75.75 0 0 0-.483.18.546.546 0 0 0-.137.185.745.745 0 0 0-.054.218h1.261m.823 1.35a1.55 1.55 0 0 1-.576.447 1.8 1.8 0 0 1-.73.158c-.227 0-.454-.038-.668-.115a1.594 1.594 0 0 1-.549-.327 1.427 1.427 0 0 1-.368-.506 1.73 1.73 0 0 1 0-1.323 1.47 1.47 0 0 1 .368-.506c.158-.144.345-.256.549-.326a1.96 1.96 0 0 1 .669-.115c.207-.003.412.036.603.115.175.07.332.183.455.326.13.148.23.32.291.506.07.215.105.439.104.664v.294h-2.194a.74.74 0 0 0 .253.43c.129.111.295.169.465.164a.72.72 0 0 0 .4-.104 1.08 1.08 0 0 0 .28-.267l.648.485M128.639 81.86h-.27a1.24 1.24 0 0 0-.312.055.644.644 0 0 0-.252.13.3.3 0 0 0-.105.246.272.272 0 0 0 .149.255.589.589 0 0 0 .302.082.86.86 0 0 0 .268-.038.847.847 0 0 0 .236-.109.495.495 0 0 0 .22-.43v-.202l-.236.012m.236.958a.862.862 0 0 1-.423.354 1.47 1.47 0 0 1-.971.05.92.92 0 0 1-.598-.478 1.027 1.027 0 0 1 0-.856.888.888 0 0 1 .27-.305c.117-.081.246-.143.383-.185.147-.045.297-.078.45-.098.153-.02.306-.034.46-.039h.429a.483.483 0 0 0-.181-.396.637.637 0 0 0-.428-.153.933.933 0 0 0-.428.098c-.133.066-.25.16-.346.272l-.51-.517c.179-.168.392-.294.625-.37.237-.083.485-.125.735-.125.235-.006.469.03.692.103a1 1 0 0 1 .427.305c.114.146.192.315.23.495.042.225.062.452.061.68v1.558h-.877v-.393M130.328 80.14h.955v.49c.087-.166.21-.311.362-.424a.948.948 0 0 1 .548-.142h.165l.154.027v.866a1.33 1.33 0 0 0-.198-.05 1.347 1.347 0 0 0-.208 0 1.072 1.072 0 0 0-.434.077.55.55 0 0 0-.241.212.724.724 0 0 0-.115.327c-.01.138-.01.276 0 .413v1.28h-.988V80.14M134.914 81.158a.577.577 0 0 0-.472-.234.75.75 0 0 0-.549.212.905.905 0 0 0 0 1.128c.146.142.345.219.549.211a.494.494 0 0 0 .274-.07.718.718 0 0 0 .198-.163l.625.658a1.248 1.248 0 0 1-.521.316 1.935 1.935 0 0 1-1.245-.022 1.648 1.648 0 0 1-.549-.326 1.477 1.477 0 0 1-.362-.507 1.624 1.624 0 0 1 .362-1.829 1.64 1.64 0 0 1 .549-.326 1.935 1.935 0 0 1 1.245-.022c.198.06.377.17.52.316l-.624.658M136.839 78.437v2.122a.542.542 0 0 1 .11-.179.86.86 0 0 1 .18-.158c.082-.048.169-.086.259-.114.101-.03.206-.044.312-.044.203-.008.404.03.587.114a.813.813 0 0 1 .346.305c.087.14.145.295.17.458.029.19.044.383.044.577v1.687h-.955v-1.502a2.282 2.282 0 0 0 0-.272.82.82 0 0 0-.054-.262.448.448 0 0 0-.149-.196.46.46 0 0 0-.28-.076.617.617 0 0 0-.3.065.447.447 0 0 0-.17.18.593.593 0 0 0-.083.245 2.666 2.666 0 0 0 0 .294v1.524h-.955v-4.768h.938"/></g><path fill="#8F959E" d="m146.657 94.642-5.273 3.697 6.805 9.56 5.273-3.698z"/><path fill="#FFD500" d="M147.543 106.345a2.086 2.086 0 0 0-.506 2.922l13.15 18.473a2.123 2.123 0 0 0 2.945.502l4.645-3.257a2.086 2.086 0 0 0 .507-2.92l-13.151-18.474a2.122 2.122 0 0 0-2.943-.503l-4.647 3.257M142.69 91.54c7.016-4.917 8.687-14.547 3.732-21.509-4.954-6.962-14.658-8.62-21.674-3.702-7.015 4.917-8.685 14.546-3.73 21.508v.002c4.955 6.96 14.658 8.618 21.673 3.701m-22.408-31.486c10.507-7.364 25.04-4.88 32.46 5.548 7.42 10.429 4.917 24.851-5.591 32.214-10.507 7.364-25.038 4.88-32.459-5.546-7.42-10.427-4.919-24.85 5.588-32.215a.007.007 0 0 0 .002-.001"/><path fill="#FFF" d="M133.722 63.505c-8.588 0-15.55 6.91-15.55 15.433s6.962 15.433 15.55 15.433c8.589 0 15.551-6.91 15.551-15.433s-6.962-15.433-15.55-15.433"/><path fill="#DFE3E9" fillRule="nonzero" d="M135.303 82.515v-.322c0-.551.12-1.034.358-1.493.215-.414.525-.805.954-1.15 1.144-.965 1.836-1.585 2.05-1.815.573-.736.883-1.678.883-2.827 0-1.402-.477-2.505-1.431-3.31-.954-.827-2.218-1.217-3.768-1.217-1.764 0-3.147.482-4.172 1.447-1.05.966-1.55 2.299-1.55 4h2.718c0-.966.19-1.724.596-2.253.453-.643 1.192-.942 2.242-.942.81 0 1.454.207 1.907.643.43.437.668 1.035.668 1.793 0 .575-.215 1.126-.644 1.632l-.286.321c-1.55 1.333-2.48 2.299-2.79 2.92-.334.62-.477 1.378-.477 2.251v.322h2.742m-1.228 4.854a1.784 1.784 0 0 0 1.832-1.832c0-.53-.188-.965-.516-1.302-.353-.338-.799-.506-1.316-.506-.516 0-.939.168-1.291.506-.353.337-.517.771-.517 1.302 0 .53.164.964.517 1.302.352.337.775.53 1.291.53"/></g></svg>
        <div className="text-[#8F959E]">暂无生产任务 请等待任务开启或联系相关人员</div>
      </div>
      :
      <>
        <Box className='flex-auto overflow-auto flex'>
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
                  <span className="flex-1">{dayjs(taskInfo.PlanStartTime).format('HH:mm')} <span className="text-xl">{dayjs(taskInfo.PlanStartTime).format('MM/DD')}</span></span>
                  <span className="flex-1">{dayjs(taskInfo.PlanStartTime).format('HH:mm')} <span className="text-xl">{dayjs(taskInfo.PlanEndTime).format('MM/DD')}</span></span>
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
            </Box>
            <div className='flex-auto mt-8px overflow-auto' sx={{display:tabType===0?'block':'none'}}>
              {
                docLoading
                ?
                <div className="w-full h-full flex justify-center items-center">
                  <CircularProgress size={80} />
                </div>
                :
                null
              }
              {
                isNoDoc
                ?
                <div className="h-full flex flex-col justify-center items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="195" height="146"><g fill="none" fillRule="evenodd"><path fill="#EEF1F5" d="M97.08 112.856c50.265 0 91.013 5.433 91.013 12.135 0 6.701-40.748 12.135-91.013 12.135-50.265 0-91.012-5.434-91.012-12.135 0-6.702 40.747-12.135 91.012-12.135"/><path fill="#8F959E" fillRule="nonzero" d="M129.454 51.548a8.357 8.357 0 0 1 8.497 8.227v57.414a7.201 7.201 0 0 1-7.297 7.076H49.77a7.201 7.201 0 0 1-7.297-7.076v-67.25a7.201 7.201 0 0 1 7.297-7.075h31.2c4.949 0 8.957 3.893 8.957 8.689h39.528v-.005"/><path fill="#DFE3E9" fillRule="nonzero" d="M69.864 14.562h54.896a8 8 0 0 1 5.658 2.344l10.788 10.792a8 8 0 0 1 2.342 5.656v70.965a8 8 0 0 1-7.831 7.998l-65.684 1.385a8 8 0 0 1-8.169-7.998V22.562a8 8 0 0 1 8-8"/><path fill="#FFF" d="M75.805 31.473h52.174c.6 0 1.087.487 1.087 1.087v2.174c0 .6-.487 1.087-1.087 1.087H75.805c-.6 0-1.087-.487-1.087-1.087V32.56c0-.6.486-1.087 1.087-1.087M75.805 44.517H109.5c.6 0 1.087.486 1.087 1.087v2.173c0 .6-.486 1.087-1.087 1.087H75.805c-.6 0-1.087-.486-1.087-1.087v-2.173c0-.6.486-1.087 1.087-1.087M75.805 57.56h23.913c.6 0 1.087.487 1.087 1.087v2.174c0 .6-.487 1.087-1.087 1.087H75.805c-.6 0-1.087-.487-1.087-1.087v-2.174c0-.6.486-1.087 1.087-1.087"/><path fill="#000" fillRule="nonzero" d="M73.789 64.736h82.47c3.585 0 5.491 2.491 4.248 5.563l-18.548 45.893c-1.238 3.072-5.155 5.564-8.74 5.564H50.743c-3.586 0-5.487-2.492-4.244-5.564L65.043 70.3c1.243-3.072 5.155-5.563 8.746-5.563" opacity=".1"/><path fill="#8F959E" fillRule="nonzero" d="M76.724 67.671h82.47c3.586 0 5.491 2.491 4.248 5.563l-18.547 45.894c-1.239 3.072-5.155 5.563-8.741 5.563H53.679c-3.585 0-5.486-2.491-4.243-5.563l18.543-45.894c1.243-3.072 5.155-5.563 8.745-5.563"/><path fill="#D2D4D8" fillRule="nonzero" d="M118.473 82.84a1.733 1.733 0 0 1-1.522-.725 2.045 2.045 0 0 1-.058-1.92l.96-2.319a4.214 4.214 0 0 1 3.524-2.477h28.253a1.757 1.757 0 0 1 1.521.725c.338.59.36 1.31.058 1.92l-.96 2.323a4.21 4.21 0 0 1-3.528 2.472h-28.248"/><path fill="#FFD500" d="M163.667 115.965s-6.846-1.77-8.339-7.803c0 0 10.614-2.029 10.922 8.334l-2.583-.53"/><path fill="#FFD500" d="M163.357 115.27s-4.068-6.893-.488-13.336c0 0 6.861 4.668 3.813 13.349l-3.325-.013"/><path fill="#FFD500" d="M165.036 116.476s2.38-8.146 9.578-9.688c0 0 1.35 5.316-4.657 9.708l-4.921-.02"/><path fill="#8F959E" d="m160.182 115.283 1.327 9.667 8.36.04 1.234-9.662z"/><g fillRule="nonzero"><path fill="#000" fillOpacity=".1" d="M24.27 111.642c0 10.053 8.15 18.203 18.202 18.203 10.053 0 18.203-8.15 18.203-18.203 0-10.053-8.15-18.202-18.202-18.202-10.053 0-18.203 8.149-18.203 18.202"/><path fill="#FFD500" d="M26.697 109.215c0 10.053 8.15 18.203 18.203 18.203 10.052 0 18.202-8.15 18.202-18.203 0-10.053-8.15-18.202-18.202-18.202-10.053 0-18.203 8.149-18.203 18.202"/><path fill="#FFF" d="M52.92 101.188a1.581 1.581 0 0 1 0 2.257l-5.861 5.78 5.86 5.78a1.58 1.58 0 0 1 .084 2.125l-.104.112a1.634 1.634 0 0 1-2.269.02l-5.859-5.78-5.584 5.507a1.633 1.633 0 0 1-1.573.435 1.607 1.607 0 0 1-1.156-1.14 1.582 1.582 0 0 1 .441-1.552l5.583-5.507-5.583-5.507a1.583 1.583 0 0 1-.474-1.399l.033-.153c.148-.558.59-.994 1.156-1.14a1.633 1.633 0 0 1 1.573.435l5.583 5.507 5.86-5.78a1.635 1.635 0 0 1 2.29 0"/></g></g></svg>
                  <span className="text-[#8F959E]">暂无文档</span>
                </div>
                :
                null
              }
              <div ref={pdfContainer} className="children:w-full"></div>
            </div>
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
        <Box className='h-98px flex-none bg-white mt-16px py-13px px-16px flex justify-between items-center -mr-16px'>
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
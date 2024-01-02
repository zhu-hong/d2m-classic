import { useConfigStore, useDeyboardStore } from "@/store.jsx"
import { Close } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, OutlinedInput } from "@mui/material"
import { StationsDialog } from "./stationsDialog.jsx"
import { useEffect } from "react"
import { useState } from "react"
import { useApi } from "@/hook.js"
import { enqueueSnackbar } from "notistack"
import workerAvatar from '../assets/worker-avatar.png?url'
import dayjs from "dayjs"

export const ScanFlow = ({ open, onClose }) => {
  const [jobNum, setJobNum] = useState('')
  const [jobNumOpen, setJobNumOpen] = useState(false)
  const [curStation, setCurStation] = useState(null)
  const [stationOpen, setStationOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  /**
   * 0 未签到
   * 1 已签到
   */
  const [user, setUser] = useState(null)

  const { config, workstations } = useConfigStore()

  useEffect(() => {
    setJobNumOpen(open)

    if(open === false) {
      setStationOpen(false)
      setConfirmOpen(false)
      setCurStation(null)
      setUser(null)
    }
  }, [open])

  const api = useApi(config.serveUrl)

  const onConfirmJobNum = () => {
    api().IsLogin({
      WorkstationGuid: workstations[0].WorkstationGuid,
      Code: jobNum,
    }).then((res) => {
      if(res.code === 0) {
        setJobNumOpen(false)
        if(workstations.length === 1) {
          onConfirmStation(workstations[0].WorkstationGuid)
        } else {
          setStationOpen(true)
        }
      }
    })
  }

  const onConfirmStation = (sid) => {
    const target = workstations.find((w) => w.WorkstationGuid === sid)
    setCurStation(target)
    
    api().IsLogin({
      WorkstationGuid: sid,
      Code: jobNum,
    }).then((res) => {
      if(res.code === 0) {
        setStationOpen(false)
        setUser(res.data)
        setConfirmOpen(true)
      }
    })
  }

  const onConfirmLoginout = () => {
    if(user.State === 1) {
      api().PersonLogout({
        Code: jobNum,
        MachineGuid: config.MachineGuid,
        WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
        WorkstationGuid: curStation.WorkstationGuid,
      }).then((res) => {
        if(res.code === 0) {
          enqueueSnackbar('签退成功', { variant: 'success' })
          onClose()
        }
      })
    } else if(user.State === 0) {
      api().PersonLogin({
        Code: jobNum,
        MachineGuid: config.MachineGuid,
        WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
        WorkstationGuid: curStation.WorkstationGuid,
      }).then((res) => {
        if(res.code === 0) {
          enqueueSnackbar('签到成功', { variant: 'success' })
          onClose()
        }
      })
    }
  }

  const deyboard = useDeyboardStore()

  const onFocus = () => {
    deyboard.setDeyboardValue(jobNum)
    deyboard.setMiddleFunc(setJobNum)
    deyboard.openDeyboard()
  }

  useEffect(() => {
    if(!jobNumOpen) {
      deyboard.closeDeyboard()
    }
  }, [jobNumOpen])

  return <>
    <Dialog open={jobNumOpen}>
      <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
        <p>人员操作</p>
        <IconButton onClick={onClose}><Close/></IconButton>
      </DialogTitle>
      <DialogContent className="w-536px">
        <div className="py-24px flex justify-center items-center">
          <OutlinedInput size="small" value={jobNum} onFocus={onFocus} onChange={(e) => {
            setJobNum(e.target.value)
            deyboard.setDeyboardValue(e.target.value)
          }} className="mt-32px w-280px" placeholder='请输入您的工号'/*  endAdornment={<IconButton><svg className="flex-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M22 15a1 1 0 0 1 1 1v4a3 3 0 0 1-3 3h-4a1 1 0 0 1 0-2h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1M2 15a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 1 0 2H4a3 3 0 0 1-3-3v-4a1 1 0 0 1 1-1m21-4v2H1v-2zM20 1a3 3 0 0 1 3 3v4a1 1 0 0 1-2 0V4a1 1 0 0 0-1-1h-4a1 1 0 0 1 0-2zM8 1a1 1 0 1 1 0 2H4a1 1 0 0 0-1 1v4a1 1 0 1 1-2 0V4a3 3 0 0 1 3-3z"/></svg></IconButton>} */ />
        </div>
      </DialogContent>
      <DialogActions style={{justifyContent:'center',paddingBottom:'64px'}}>
        <Button disabled={jobNum===''} className="w-136px h-56px" variant="contained" onClick={() => onConfirmJobNum(jobNum)}><span className="text-2xl text-white">确认</span></Button>
        <Button className="w-136px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}} onClick={onClose}><span className="text-2xl text-[#646A73]">取消</span></Button>
      </DialogActions>
    </Dialog>

    <StationsDialog open={stationOpen} onClose={onClose} stations={workstations} onConfirm={onConfirmStation} />

    {
      confirmOpen
      ?
      <Dialog open={confirmOpen} maxWidth='640px'>
        <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
          <p>信息确认</p>
          <IconButton onClick={onClose}><Close/></IconButton>
        </DialogTitle>
        <DialogContent className="w-640px">
          <div className="w-504px pt-18px pb-34px border border-[#CECECE] mx-auto mt-24px">
            <div className="w-352px mx-auto flex items-center">
              <img src={user.EmployeePicture?'data:image/png;base64,'+user.EmployeePicture:workerAvatar} className="flex-none w-96px h-96px object-cover mr-16px" />
              <div className="flex-auto text-xl text-[#000c25]">
                <div>姓名：{user.EmployeeName}</div>
                <div className="mt-16px">工号：{user.EmployeeCode}</div>
              </div>
            </div>
              {
                user.ShiftName
                ?
                <div className="w-352px mx-auto mt-16px border border-[#CECECE] px-16px py-24px flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#2E3A59" fillRule="nonzero" d="M20 1.007a3 3 0 0 1 2.995 2.823l.005.177v9.927a1 1 0 0 1-1.993.116L21 13.934V4.007a1 1 0 0 0-.883-.994L20 3.007H4a1 1 0 0 0-.993.883L3 4.007v16a1 1 0 0 0 .883.993l.117.007h7.43A1 1 0 0 1 11.547 23l-.117.007H4a3 3 0 0 1-2.995-2.824L1 20.007v-16a3 3 0 0 1 2.824-2.995L4 1.007h16m2.538 15.608a1 1 0 0 1 .083 1.32l-.083.095-4.307 4.312a1.5 1.5 0 0 1-2.008.103l-.114-.103-2.419-2.34a1 1 0 0 1 1.32-1.497l.095.084 2.065 1.985 3.954-3.959a1 1 0 0 1 1.414 0M8.443 13.75c1.552 0 2.94.426 4.136 1.276a1 1 0 0 1-1.158 1.63c-.851-.605-1.834-.906-2.978-.906-1.134 0-2.067.296-2.834.884a1 1 0 0 1-1.218-1.586c1.129-.866 2.491-1.298 4.052-1.298M17 12v2h-4v-2zM8.5 6a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7m0 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M19 8v2h-6V8z"/></svg>
                  <div className="flex-auto text-xl text-[#000c25] ml-8px">{`${user.ShiftName}\t${dayjs(user.ShiftStartTime).format('MM/DD H:mm')}~${dayjs(user.ShiftEndTime).format('MM/DD H:mm')}`}</div>
                </div>
                :
                <div className="w-352px mx-auto mt-16px border border-[#CECECE] px-16px py-10px">
                  <div className="text-[#8F959E]">暂无班次</div>
                  <div className="mt-4px flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path fill="#F90" fillRule="evenodd" d="M8.18 2c.233 0 .453.127.573.333L14.933 13a.669.669 0 0 1-.58 1H2a.669.669 0 0 1-.58-.333.696.696 0 0 1 0-.667L7.6 2.333A.669.669 0 0 1 8.18 2m.665 8.667H7.512V12h1.333v-1.333m0-4.667H7.512v3.333h1.333V6"/></svg>
                    <span className="text-[#FF9900] ml-8px">请联系管理员设置班次</span>
                  </div>
                </div>
              }
            <div className="w-352px mx-auto mt-16px border border-[#CECECE] px-16px py-24px flex items-center">
              <svg className="flex-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#000c25" fillRule="nonzero" d="M14 1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4v1.014h6V9a1 1 0 0 1 2 0v1.014h1V7a1 1 0 0 1 2 0v3.014h.131a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5.05a2 2 0 0 1-2-2v-5.57H7.906v5.57a2 2 0 0 1-2 2H3.131a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2H8V9H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm7.131 11.015h-18v9h2.775v-7.57h10.175v7.57h5.05v-9M14 3H4v4h10z"/></svg>
              <div className="flex-auto text-xl text-[#000c25] ml-8px">{curStation.WorkstationName}</div>
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{justifyContent:'center',paddingBottom:'42px'}}>
          <Button className="w-136px h-56px" variant="contained" onClick={onConfirmLoginout}><span className="text-2xl text-white">确认{['签到','签退'][user.State]}</span></Button>
          <Button className="w-136px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}} onClick={onClose}><span className="text-2xl text-[#646A73]">取消</span></Button>
        </DialogActions>
      </Dialog>
      :
      null
    }
  </>
}

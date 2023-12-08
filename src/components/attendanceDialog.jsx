import { useApi } from '@/hook.js'
import { useConfigStore } from '@/store.jsx'
import { LocationOnOutlined } from '@mui/icons-material'
import { ArrowBackIosNew } from '@mui/icons-material'
import { ArrowForwardIos } from '@mui/icons-material'
import { Close } from '@mui/icons-material'
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Paper } from '@mui/material'
import { useCallback } from 'react'
import { forwardRef } from 'react'
import { useImperativeHandle } from 'react'
import { useState } from 'react'
import { JobNumDialog } from './jobNumDialog.jsx'
import { enqueueSnackbar } from 'notistack'
import workerAvatar from '../assets/worker-avatar.png?url'

export const AttendanceDialog = forwardRef(({ workcenter, onConfirm }, ref) => {
  const { config } = useConfigStore()
  
  const [open, setOpen] = useState(false)
  const [users, setUsers] = useState([])
  const [jobNumOpen, setJobNumOpen] = useState(false)
  const [curStation, setCurStation] = useState(null)
  /**
   * 0 统一签退
   * 1 签到
   * 2 签退
   */
  const [logMode, setLogMode] = useState(0)

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        getUsers()
        setOpen(true)
      }
    }
  })

  const api = useApi(config.serveUrl)

  const getUsers = useCallback(() => {
    api().GetLoginUser({
      MachineGuid: config.MachineGuid,
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
    }).then((res) => {
      if(res.code === 0) {
        setUsers(res.data)
      }
    })
  }, [config.MachineGuid, config.terminalInfo.WorkcenterGuid])

  const onClockDir = (e, dir) => {
    const target = e.currentTarget[dir===-1?'nextSibling':'previousSibling']
    target.scrollTo({
      behavior: 'smooth',
      left: target.scrollLeft + target.clientWidth * dir,
    })
  }

  const logoutTogether = (jobNum) => {
    api().PersonUnifiedLogout({
      MachineGuid: config.MachineGuid,
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
      Code: jobNum,
    }).then((res) => {
      if(res.code === 0) {
        enqueueSnackbar('统一签退成功', { variant: 'success' })
        getUsers()
        onConfirm()
      }
    })
  }

  const applyLogin = (jobNum) => {
    api().PersonLogin({
      MachineGuid: config.MachineGuid,
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
      WorkstationGuid: curStation.WorkstationGuid,
      Code: jobNum,
    }).then((res) => {
      if(res.code === 0) {
        enqueueSnackbar('签到成功', { variant: 'success' })
        getUsers()
        onConfirm()
      }
    })
  }

  const applyLogout = (jobNum) => {
    api().PersonLogout({
      MachineGuid: config.MachineGuid,
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
      WorkstationGuid: curStation.WorkstationGuid,
      Code: jobNum,
    }).then((res) => {
      if(res.code === 0) {
        enqueueSnackbar('签退成功', { variant: 'success' })
        getUsers()
        onConfirm()
      }
    })
  }

  const onLogin = (s) => {
    setCurStation(s)
    setJobNumOpen(true)
    setLogMode(1)
  }

  const onLogout = (s) => {
    setCurStation(s)
    setJobNumOpen(true)
    setLogMode(2)
  }

  const onJobNumConfirm = (jobNum) => {
    setJobNumOpen(false)
    if(logMode === 0) {
      logoutTogether(jobNum)
    } else if(logMode === 1) {
      applyLogin(jobNum)
    } else {
      applyLogout(jobNum)
    }
  }

  return  <Dialog open={open} maxWidth='916px' onClose={() => setOpen(false)} scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>班次签到</p>
      <IconButton onClick={() => setOpen(false)}><Close/></IconButton>
    </DialogTitle>
    <DialogContent className='w-916px'>
      {
        workcenter.ShiftName === ''
        ?
        <Box className='flex-none text-[#000C25] text-xl font-medium my-4'><span className="text-[#646A73]">暂无班次</span></Box>
        :
        <Box className='flex mt-24px mb-16px'>
          <Box className='mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">当前班次：</span>{workcenter.ShiftName}</Box>
          <Box className='mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">班次时间：</span>{workcenter.ShiftStartTime}～{workcenter.ShiftEndTime}</Box>
          <Box className='text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">在岗人员：</span>{workcenter.Amount}人</Box>
        </Box>
      }
      <Button variant='contained' size='large' onClick={() => {
        setLogMode(0)
        setJobNumOpen(true)
      }}><Box className='text-2xl'>统一签退</Box></Button>
      {
        users.map((u) => {
          return <Box key={u.WorkstationGuid} className='mt-16px w-full px-16px py-18px bg-[#F4F6F8]'>
            <Box className='flex justify-between items-center text-[#000c25]'>
              <LocationOnOutlined />
              <Box className='text-xl ml-9px'>{u.WorkstationName}</Box>
              <Box className='flex-auto'></Box>
              <Button onClick={() => onLogin(u)} variant='outlined' sx={{marginRight:'9px'}}>签到</Button>
              <Button variant='outlined' onClick={() => onLogout(u)}>签退</Button>
            </Box>
            <Box className='flex justify-between items-center text-[#000c25] mt-16px'>
              <IconButton onClick={(e) => onClockDir(e, -1)} className='flex-none' color='secondary'><ArrowBackIosNew /></IconButton>
              <Box className='flex-auto mx-16px w-full overflow-x-auto flex -mr-16px'>
                {
                  u.Employees.length === 0
                  ?
                  <div className='w-full text-center text-[#8F959E]'>暂无人员</div>
                  :
                  u.Employees.map((e) => {
                    return <Paper key={e.EmployeeCode} className='flex-none mr-16px flex justify-between items-center p-16px w-220px'>
                      <img src={e.EmployeePicture||workerAvatar} className='w-64px h-64px flex-none rounded-full object-cover border border-[#058373]' />
                      <Box className='ml-16px flex-auto'>
                        <Box className='mb-8px text-[#000C25]'>姓名：{e.EmployeeName}</Box>
                        <Box className='text-[#646A73]'>工号：{e.EmployeeCode}</Box>
                      </Box>
                    </Paper>
                  })
                }
              </Box>
              <IconButton onClick={(e) => onClockDir(e, 1)} className='flex-none' color='secondary'><ArrowForwardIos /></IconButton>
            </Box>
          </Box>
        })
      }
    </DialogContent>

    <JobNumDialog open={jobNumOpen} onClose={() => setJobNumOpen(false)} onConfirm={onJobNumConfirm} />
  </Dialog>
})

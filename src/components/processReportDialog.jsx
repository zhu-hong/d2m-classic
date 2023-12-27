import { useApi } from "@/hook.js"
import { useConfigStore, useDeyboardStore } from "@/store.jsx"
import { delay } from "@/utils.js"
import { Close } from "@mui/icons-material"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, OutlinedInput, Select, TextField } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import { useEffect } from "react"
import { useState } from "react"

export const ProcessReport = ({ open, onClose, task, validateInfo, onConfirmReport }) => {
  const [stationId, setStationId] = useState('')
  const [pass, setPass] = useState(0)
  const [noPass, setNoPass] = useState(0)

  const { config } = useConfigStore()
  const api = useApi(config.serveUrl)

  useEffect(() => {
    if(validateInfo.Workstations && validateInfo.Workstations.length !== 0) {
      setStationId(validateInfo.Workstations[0].WorkstationGuid)
    }
  }, [])

  const onConfirm = () => {
    if(stationId === '') {
      enqueueSnackbar('请选择所在工位', { variant: 'warning' })
      return
    }
    if(Number(pass)+Number(noPass) === 0) {
      enqueueSnackbar('请输入及格/不及格数量', { variant: 'warning' })
      return
    }

    api().WorkstationReport({
      QualifiedAmount: Number(pass),
      SchedulingGuid: validateInfo.SchedulingGuid,
      TaskGuid: task.TaskGuid,
      UnqualifiedAmount: Number(noPass),
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
      WorkstationGuid: stationId,
    }).then((res) => {
      if(res.code === 0) {
        enqueueSnackbar('报工成功', { variant: 'success' })
        onClose()
        deyboard.closeDeyboard()
        onConfirmReport()
      }
    })
  }

  const deyboard = useDeyboardStore()

  const onPassFocus = async () => {
    deyboard.setDeyboardValue(pass)
    deyboard.setMiddleFunc((value) => {
      if(value !== '0' && !value.includes('.')) {
        value = value.replace(/^0+/, '')
      }
      setPass(value)
    })
    if(deyboard.open) {
      deyboard.closeDeyboard()
      await delay(1)
    }
    deyboard.setLayoutName('number')
    deyboard.openDeyboard()
  }
  const onNoPassFocus = async () => {
    deyboard.setDeyboardValue(noPass)
    deyboard.setMiddleFunc((value) => {
      if(value !== '0' && !value.includes('.')) {
        value = value.replace(/^0+/, '')
      }
      setNoPass(value)
    })
    if(deyboard.open) {
      deyboard.closeDeyboard()
      await delay(1)
    }
    deyboard.setLayoutName('number')
    deyboard.openDeyboard()
  }

  return <Dialog open={open} maxWidth='720px' scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>报工反馈</p>
      <IconButton onClick={() => {
        onClose()
        deyboard.closeDeyboard()
      }}><Close /></IconButton>
    </DialogTitle>
    <DialogContent className="w-720px px-32px">
      <Box className='mt-24px bg-[#E6F2F1] border border-[#058373] px-28px py-21px'>
        <Box className='flex text-lg font-medium text-[#000C25]'>
          <Box className='flex-1'>任务编号：{task.TaskCode}</Box>
          <Box className='flex-1'>产品编号：{task.ProductCode}</Box>
        </Box>
        <Box className='flex text-lg font-medium text-[#000C25] mt-21px'>
          <Box className='flex-1'>产品名称：{task.ProductName}</Box>
          <Box className='flex-1'>制程：{task.ProcessName}</Box>
        </Box>
      </Box>
      <Box className='mt-24px flex justify-center items-center'>
        <Box className='w-90px text-left text-[#646A73] text-lg mr-24px'>报工人员：</Box>
        <OutlinedInput readOnly size='small' className='w-494px' value={validateInfo.EmployeeName} />
      </Box>
      <Box className='mt-24px flex justify-center items-center'>
        <Box className='w-90px text-left text-[#646A73] text-lg mr-24px'>所在工位：</Box>
        <Select size='small' className='w-494px' value={stationId} onChange={(e) => setStationId(e.target.value)}>
          {
            validateInfo.Workstations.map((w) => <MenuItem key={w.WorkstationGuid} value={w.WorkstationGuid}>{w.WorkstationName}</MenuItem>)
          }
        </Select>
      </Box>
      <Box className='mt-24px flex justify-center items-center'>
        <Box className='w-90px text-left text-[#646A73] text-lg mr-24px'>当前班次：</Box>
        <OutlinedInput readOnly size='small' className='w-494px' value={validateInfo.ShiftName} />
      </Box>
      <Box className='mt-24px flex text-[#646A73] text-lg justify-center items-center'>
        <Box className='w-90px text-left mr-24px'>合格数：</Box>
        <TextField onFocus={onPassFocus} value={pass} onChange={(e) => {
          let value = e.target.value
          if(value !== '0' && !value.includes('.')) {
            value = value.replace(/^0+/, '')
          }
          setPass(value)
          deyboard.setDeyboardValue(value)
        }} size='small' className='w-184px' type="number" inputProps={{ min: 0 }} />
        <Box className='ml-36px'>不合格数：</Box>
        <TextField onFocus={onNoPassFocus} value={noPass} onChange={(e) => {
          let value = e.target.value
          if(value !== '0' && !value.includes('.')) {
            value = value.replace(/^0+/, '')
          }
          setNoPass(value)
          deyboard.setDeyboardValue(value)
        }} size='small' className='w-184px' type="number" inputProps={{ min: 0 }} />
      </Box>
    </DialogContent>
    <DialogActions style={{justifyContent:'center'}}>
      <Button onClick={onConfirm} className="w-144px h-56px" variant="contained"><span className="text-2xl text-white">确认</span></Button>
      <Button className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}} onClick={() => {
        onClose()
        deyboard.closeDeyboard()
      }}><span className="text-2xl text-[#646A73]">取消</span></Button>
    </DialogActions>
  </Dialog>
}

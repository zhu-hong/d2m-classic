import { forwardRef, useImperativeHandle } from 'react'
import { useState } from 'react'

import { Close, AccessTime } from '@mui/icons-material'
import { 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  IconButton,
  ListItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Select,
  MenuItem,
  DialogActions,
  OutlinedInput,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { useConfigStore } from '@/store.jsx'
import { enqueueSnackbar } from 'notistack'
import { useEffect } from 'react'
import { useApi } from '@/hook.js'

export const ConfigDialog = forwardRef(({ onConfirmSuccess }, ref) => {
  const { config } = useConfigStore()

  const [configOpen, setConfigOpen] = useState(false)
  const [configTemp, setConfigTemp] = useState(JSON.parse(JSON.stringify(config)))

  const [workshopList, setWorkshopList] = useState([])
  const [machineList, setMachineList] = useState([])

  const api = useApi(config.serveUrl)

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setConfigTemp(JSON.parse(JSON.stringify(config)))
        setConfigOpen(true)

        api().GetWorkshop().then((res) => {
          setWorkshopList(res.data)
        })
      }
    }
  })

  useEffect(() => {
    if(configTemp.WorkshopGuid) {
      api().GetMachine({
        WorkshopGuid: configTemp.WorkshopGuid,
      }).then((res) => {
        setMachineList(res.data)
      })
    }
  }, [configTemp.WorkshopGuid])

  const setConfigTempByKey = (key, value) => {
    setConfigTemp((configTemp) => {
      if(key === 'WorkshopGuid') {
        return {
          ...configTemp,
          WorkshopGuid: value,
          WorkshopName: workshopList.find((w) => w.WorkshopGuid === value).WorkshopName,
          MachineGuid: '',
        }
      }
      return {
        ...configTemp,
        [key]: value,
      }
    })
  }

  const onConfirm = () => {
    if(!validationConfig(true)) return

    setConfigOpen(false)
    onConfirmSuccess(configTemp)
  }

  const validationConfig = () => {
    if(configTemp.WorkshopGuid === '') {
      enqueueSnackbar('请选择区域', {
        variant: 'warning',
      })
      return false
    }
    if(configTemp.MachineGuid === '') {
      enqueueSnackbar('请选择一体机', {
        variant: 'warning',
      })
      return false
    }
    return true
  }

  return <Dialog open={configOpen} maxWidth='640px' onClose={() => setConfigOpen(false)}>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>系统配置</p>
      <IconButton onClick={() => setConfigOpen(false)}><Close/></IconButton>
    </DialogTitle>
    <DialogContent className='w-640px'>
      <List>
        <ListItem className='flex items-center text-lg text-[#646A73]'>
          <span className='w-100px flex-none'>服务URL：</span>
          <OutlinedInput size='small' className='w-460px' placeholder='请输入' onChange={(e) => setConfigTempByKey('serveUrl', e.target.value)} startAdornment={<InputAdornment position="start">http://</InputAdornment>} value={configTemp.serveUrl} />
        </ListItem>
        <ListItem className='flex items-center text-lg text-[#646A73]'>
          <span className='w-100px flex-none'>区域：</span>
          <Select value={configTemp.WorkshopGuid} size='small' className='w-460px' onChange={(e) => setConfigTempByKey('WorkshopGuid', e.target.value)}>
            {
              workshopList.length === 0
              ?
              <MenuItem disabled>
                <ListItemIcon>
                  <AccessTime />
                </ListItemIcon>
                <ListItemText>暂无数据</ListItemText>
              </MenuItem>
              :
              workshopList.map((w) => <MenuItem key={w.WorkshopGuid} value={w.WorkshopGuid}>{w.WorkshopName}</MenuItem>)
            }
          </Select>
        </ListItem>
        <ListItem className='flex items-center text-lg text-[#646A73]'>
          <span className='w-100px flex-none'>一体机：</span>
          <Select value={configTemp.MachineGuid} size='small' className='w-460px' onChange={(e) => setConfigTempByKey('MachineGuid', e.target.value)} disabled={configTemp.WorkshopGuid === ''}>
            {
              machineList.length === 0
              ?
              <MenuItem disabled>
                <ListItemIcon>
                  <AccessTime />
                </ListItemIcon>
                <ListItemText>暂无数据</ListItemText>
              </MenuItem>
              :
              machineList.map((m) => <MenuItem key={m.MachineGuid} value={m.MachineGuid}>{m.MachineName}</MenuItem>)
            }
          </Select>
        </ListItem>
        <ListItem className='flex items-center text-lg text-[#646A73]'>
          <span className='w-100px flex-none'>终端类型：</span>
          <RadioGroup row value={configTemp.terminalType} onChange={(e) => setConfigTempByKey('terminalType', e.target.value)}>
            <FormControlLabel value={0} control={<Radio />} label="工作中心"></FormControlLabel>
            <FormControlLabel value={1} control={<Radio />} label="工位"></FormControlLabel>
          </RadioGroup>
        </ListItem>
      </List>
      <DialogActions style={{justifyContent:'center'}}>
        <Button className="w-144px h-56px" variant="contained" onClick={onConfirm}><span className="text-2xl text-white">确认</span></Button>
        <Button className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}} onClick={() => setConfigOpen(false)}><span className="text-2xl text-[#646A73]">取消</span></Button>
      </DialogActions>
    </DialogContent>
  </Dialog>
})

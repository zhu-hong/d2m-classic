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
import { useConfigStore, useDeyboardStore } from '@/store.jsx'
import { enqueueSnackbar } from 'notistack'
import { useEffect } from 'react'
import { createApi } from '@/http.js'

export const ConfigDialog = ({ onConfirmSuccess, open, onClose }) => {
  const { config } = useConfigStore()

  const [configTemp, setConfigTemp] = useState(JSON.parse(JSON.stringify(config)))

  const [workshopList, setWorkshopList] = useState([])
  const [machineList, setMachineList] = useState([])

  const [serveUrl, setServeUrl] = useState(config.serveUrl)
  const [tempServeUrl, setTempServeUrl] = useState(config.serveUrl)

  const deyboard = useDeyboardStore()

  useEffect(() => {
    if(serveUrl === '') return

    createApi(serveUrl).GetWorkshop().then((res) => {
      setWorkshopList(res.data)
    })
  }, [])

  useEffect(() => {
    if(configTemp.WorkshopGuid != '') {
      createApi(serveUrl).GetMachine({
        WorkshopGuid: configTemp.WorkshopGuid,
      }).then((res) => {
        setMachineList(res.data)
      })
    }
  }, [configTemp.WorkshopGuid])

  const setConfigTempByKey = (key, value) => {
    setConfigTemp((configTemp) => {
      if(key === 'WorkshopGuid') {
        if(value !== '') {
          return {
            ...configTemp,
            WorkshopGuid: value,
            WorkshopName: workshopList.find((w) => w.WorkshopGuid === value).WorkshopName,
            MachineGuid: '',
          }
        } else {
          return {
            ...configTemp,
            WorkshopGuid: '',
            WorkshopName: '',
            MachineGuid: '',
          }
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

    onClose()
    console.log({
      ...configTemp,
      serveUrl,
    })
    onConfirmSuccess({
      ...configTemp,
      serveUrl,
    })
  }

  const onServeUrlBlur = () => {
    if(serveUrl !== tempServeUrl) {
      setTempServeUrl(serveUrl)
      setConfigTempByKey('WorkshopGuid', '')
      setWorkshopList([])
      setMachineList([])

      createApi(serveUrl).GetWorkshop().then((res) => {
        setWorkshopList(res.data)
      })
    }
  }

  const validationConfig = () => {
    if(serveUrl === '') {
      enqueueSnackbar('请配置服务器URL', {
        variant: 'warning',
      })
      return false
    }
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

  const onFocus = () => {
    deyboard.setDeyboardValue(serveUrl)
    deyboard.setMiddleFunc(setServeUrl)
    deyboard.openDeyboard()
  }

  return <>
    <Dialog open={open} maxWidth='640px'>
      <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
        <p>系统配置</p>
        <IconButton onClick={onClose}><Close/></IconButton>
      </DialogTitle>
      <DialogContent className='w-640px'>
        <List>
          <ListItem className='flex items-center text-lg text-[#646A73]'>
            <span className='w-100px flex-none'>服务URL：</span>
            <OutlinedInput onChange={(e) => {
              deyboard.setDeyboardValue(e.target.value)
              setServeUrl(e.target.value)
            }} onFocus={onFocus} size='small' className='w-460px' value={serveUrl} placeholder='请输入' startAdornment={<InputAdornment position="start">http://</InputAdornment>} />
          </ListItem>
          <ListItem className='flex items-center text-lg text-[#646A73]'>
            <span className='w-100px flex-none'>区域：</span>
            <Select onOpen={onServeUrlBlur} disabled={serveUrl===''} value={configTemp.WorkshopGuid} size='small' className='w-460px' onChange={(e) => setConfigTempByKey('WorkshopGuid', e.target.value)}>
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
          <Button className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}} onClick={onClose}><span className="text-2xl text-[#646A73]">取消</span></Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  </>
}

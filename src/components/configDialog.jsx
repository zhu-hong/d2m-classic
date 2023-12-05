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

export const ConfigDialog = forwardRef(({ onConfirmSuccess }, ref) => {
  const [configOpen, setConfigOpen] = useState(false)
  const { config } = useConfigStore()
  const [configTemp, setConfigTemp] = useState(JSON.parse(JSON.stringify(config)))

  const [bookList, setBookList] = useState([])
  const [workshopList, setWorkshopList] = useState([])
  const [machineList, setMachineList] = useState([])

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setConfigTemp(JSON.parse(JSON.stringify(config)))
        setConfigOpen(true)
      }
    }
  })

  const setConfigTempByKey = (key, value) => {
    setConfigTemp({
      ...configTemp,
      [key]: value,
    })

    if(key === 'workshopGuid') {
      setConfigTempByKey('machineGuid', '')
    }
  }

  const onConfirm = () => {
    if(!validationConfig(true)) return

    setConfigOpen(false)
    onConfirmSuccess(configTemp)
  }

  const validationConfig = () => {
    if(configTemp.book === '') {
      enqueueSnackbar('请选择帐套', {
        variant: 'warning',
      })
      return false
    }
    if(configTemp.workshopGuid === '') {
      enqueueSnackbar('请选择区域', {
        variant: 'warning',
      })
      return false
    }
    if(configTemp.machineGuid === '') {
      enqueueSnackbar('请选择一体机', {
        variant: 'warning',
      })
      return false
    }
    return true
  }

  return <Dialog open={configOpen} maxWidth='640px' onClose={() => setConfigOpen(false)}>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>文件配置</p>
      <IconButton onClick={() => setConfigOpen(false)}><Close/></IconButton>
    </DialogTitle>
    <DialogContent className='w-640px'>
      <List>
        <ListItem className='flex items-center text-lg text-[#646A73]'>
          <span className='w-100px'>服务URL：</span>
          <OutlinedInput size='small' className='flex-auto' placeholder='请输入' onChange={(e) => setConfigTempByKey('serveUrl', e.target.value)} startAdornment={<InputAdornment position="start">http://</InputAdornment>} value={configTemp.serveUrl} />
        </ListItem>
        <ListItem className='flex items-center text-lg text-[#646A73]'>
          <span className='w-100px'>账套：</span>
          <Select value={configTemp.book} size='small' className='flex-auto' onChange={(e) => setConfigTempByKey('book', e.target.value)}>
            {
              bookList.length === 0
              ?
              <MenuItem disabled>
                <ListItemIcon>
                  <AccessTime />
                </ListItemIcon>
                <ListItemText>暂无数据</ListItemText>
              </MenuItem>
              :
              bookList.map((w) => <MenuItem></MenuItem>)
            }
          </Select>
        </ListItem>
        <ListItem className='flex items-center text-lg text-[#646A73]'>
          <span className='w-100px'>区域：</span>
          <Select value={configTemp.workshopGuid} size='small' className='flex-auto' onChange={(e) => setConfigTempByKey('workshopGuid', e.target.value)}>
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
              workshopList.map((w) => <MenuItem value={w.workshopGuid}>{w.workshopName}</MenuItem>)
            }
          </Select>
        </ListItem>
        <ListItem className='flex items-center text-lg text-[#646A73]'>
          <span className='w-100px'>一体机：</span>
          <Select value={configTemp.machineGuid} size='small' className='flex-auto' onChange={(e) => setConfigTempByKey('machineGuid', e.target.value)} disabled={configTemp.workshopGuid === ''}>
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
              machineList.map((m) => <MenuItem value={m.machineGuid}>{m.machineName}</MenuItem>)
            }
          </Select>
        </ListItem>
        <ListItem className='flex items-center text-lg text-[#646A73]'>
          <span className='w-100px'>终端类型：</span>
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

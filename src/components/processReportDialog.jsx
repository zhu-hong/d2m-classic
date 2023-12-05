import { AccessTime } from "@mui/icons-material"
import { Close } from "@mui/icons-material"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, TextField } from "@mui/material"
import { useImperativeHandle } from "react"
import { useState, forwardRef } from "react"

export const ProcessReport = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setOpen(true)
      }
    }
  })
  return <Dialog open={open} maxWidth='720px' onClose={() => setOpen(false)} scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>报工反馈</p>
      <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
    </DialogTitle>
    <DialogContent className="w-720px px-32px">
      <Box className='mt-24px bg-[#E6F2F1] border border-[#058373] px-28px py-21px'>
        <Box className='flex text-lg font-medium text-[#000C25]'>
          <Box className='flex-1'>任务编号：RW23102890</Box>
          <Box className='flex-1'>产品编号：11-1008P-01</Box>
        </Box>
        <Box className='flex text-lg font-medium text-[#000C25] mt-21px'>
          <Box className='flex-1'>产品名称：外球笼</Box>
          <Box className='flex-1'>制程：热处理</Box>
        </Box>
      </Box>
      <Box className='mt-24px flex justify-center items-center'>
        <Box className='text-[#646A73] text-lg mr-24px'>报工人员：</Box>
        <Select size='small' className='w-494px'>
          <MenuItem disabled>
            <AccessTime />
            <span>暂无数据</span>
          </MenuItem>
        </Select>
      </Box>
      <Box className='mt-24px flex justify-center items-center'>
        <Box className='text-[#646A73] text-lg mr-24px'>所在工位：</Box>
        <Select size='small' className='w-494px'>
          <MenuItem disabled>
            <AccessTime />
            <span>暂无数据</span>
          </MenuItem>
        </Select>
      </Box>
      <Box className='mt-24px flex justify-center items-center'>
        <Box className='text-[#646A73] text-lg mr-24px'>当前班次：</Box>
        <Select size='small' className='w-494px'>
          <MenuItem disabled>
            <AccessTime />
            <span>暂无数据</span>
          </MenuItem>
        </Select>
      </Box>
      <Box className='mt-24px flex text-[#646A73] text-lg justify-center items-center'>
        <Box>合格数：</Box>
        <TextField size='small' className='w-136px' type="number" />
        <Box className='ml-24px'>不合格数：</Box>
        <TextField size='small' className='w-136px' type="number" />
      </Box>
    </DialogContent>
      <DialogActions style={{justifyContent:'center'}}>
        <Button className="w-144px h-56px" variant="contained"><span className="text-2xl text-white">确认</span></Button>
        <Button className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}} onClick={() => setOpen(false)}><span className="text-2xl text-[#646A73]">取消</span></Button>
      </DialogActions>
  </Dialog>
})

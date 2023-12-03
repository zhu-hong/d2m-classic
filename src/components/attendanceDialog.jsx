import { LocationOnOutlined } from '@mui/icons-material'
import { ArrowBackIosNew } from '@mui/icons-material'
import { ArrowForwardIos } from '@mui/icons-material'
import { Close } from '@mui/icons-material'
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Paper } from '@mui/material'
import { forwardRef } from 'react'
import { useImperativeHandle } from 'react'
import { useState } from 'react'

export const AttendanceDialog = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setOpen(true)
      }
    }
  })

  return  <Dialog open={open} maxWidth='916px' onClose={() => setOpen(false)} scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>班次签到</p>
      <IconButton onClick={() => setOpen(false)}><Close/></IconButton>
    </DialogTitle>
    <DialogContent className='w-916px'>
      <Box className='flex mt-24px mb-16px'>
        <Box className='mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">当前班次：</span>白班</Box>
        <Box className='mr-40px text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">班次时间：</span>11/01  9:00～11/01 16:00</Box>
        <Box className='text-[#000C25] text-xl font-medium'><span className="text-[#646A73]">在岗人员：</span>4人</Box>
      </Box>
      <Button variant='contained' size='large'><Box className='text-2xl'>统一签退</Box></Button>
      <Box className='mt-16px w-full px-16px py-18px bg-[#F4F6F8]'>
        <Box className='flex justify-between items-center text-[#000c25]'>
          <LocationOnOutlined />
          <Box className='text-xl ml-9px'>机加工工位A1</Box>
          <Box className='flex-auto'></Box>
          <Button variant='outlined' sx={{marginRight:'9px'}}>签到</Button>
          <Button variant='outlined'>签退</Button>
        </Box>
        <Box className='flex justify-between items-center text-[#000c25] mt-16px'>
          <IconButton color='secondary'><ArrowBackIosNew /></IconButton>
          <Box className='flex-auto mx-16px w-full overflow-x-auto flex -mr-16px'>
            <Paper className='flex-none mr-16px flex justify-between items-center p-16px w-220px'>
              <img src="https://res.d2mcloud.com/common/logo.png" className='w-64px h-64px rounded-full object-cover border border-[#058373]' />
              <Box className='ml-16px flex-auto'>
                <Box className='mb-8px text-[#000C25]'>姓名：木斌琰</Box>
                <Box className='text-[#646A73]'>工号：00005</Box>
              </Box>
            </Paper>
          </Box>
          <IconButton color='secondary'><ArrowForwardIos /></IconButton>
        </Box>
      </Box>
    </DialogContent>
  </Dialog>
})

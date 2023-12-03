import { Close } from "@mui/icons-material"
import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, LinearProgress } from "@mui/material"
import { useImperativeHandle, forwardRef, useState } from "react"

export const TaskVerification = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setOpen(true)
      }
    }
  })

  return <Dialog open={open} maxWidth='1064px' onClose={() => setOpen(false)} scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>开启任务验证</p>
      <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
    </DialogTitle>
    <DialogContent className='w-1064px h-716px flex'>
      <Box className='py-32px w-256px'>
        <Box className='flex justify-between'>
          <Box>
            <h1 className="text-[#000C25] text-xl">产品名称</h1>
            <p className="text-[#646A73] text-xs mt-8px">CP123456</p>
          </Box>
          <img src="https://res.d2mcloud.com/common/logo.png" className="w-80px h-80px object-cover" />
        </Box>
        <Divider sx={{margin:'9px 0 15px'}} />
        <Box className='flex mb-8px text-[#646A73]'>
          <span className="flex-1">任务编号</span>
          <span className="flex-1">订单编号</span>
        </Box>
        <Box className='flex mb-16px text-[#000c25]'>
          <span className="flex-1">RW23102890</span>
          <span className="flex-1">DD23102090</span>
        </Box>
        <Box className='flex mb-8px text-[#646A73]'>
          <span className="flex-1">计划开始</span>
          <span className="flex-1">计划结束</span>
        </Box>
        <Box className='flex mb-16px text-[#000c25]'>
          <span className="flex-1">23/10/28 09:00</span>
          <span className="flex-1">23/11/10 09:00</span>
        </Box>
        <Box className='flex mb-8px text-[#646A73]'>
          <span className="flex-1">计划数量(psc)</span>
        </Box>
        <Box className='flex mb-16px text-4xl'>
          <span className="text-[#000c25] flex-1">105</span>
        </Box>
      </Box>
      <Divider orientation="vertical" sx={{margin:'0 32px'}} />
      <Box className='flex-auto flex flex-col justify-between'>
        <Box className='w-full py-32px'>
          <LinearProgress variant="determinate" value={20} size={40} className="rounded" sx={{height:'10px'}} />
          <Box className='text-[#044244] text-2xl font-medium my-12px'>正在验证  78%…</Box>
        </Box>
        <Button disabled variant="contained" size="large" className="self-end w-200px h-56px"><Box className='text-2xl'>进入加工</Box></Button>
      </Box>
    </DialogContent>
  </Dialog>
})

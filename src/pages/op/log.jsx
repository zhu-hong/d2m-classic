import { AccessTime } from "@mui/icons-material"
import { Box, MenuItem, Select, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers"

const LogPage = () => {
  return <Box className='flex flex-col'>
    <Box className='h-96px bg-white px-24px mb-16px flex items-center text-lg text-[#646A73] children:mr-16px'>
      <Box>时间筛选：</Box>
      <Box>
        <DatePicker />
      </Box>
      <Box>~</Box>
      <Box>
        <DatePicker />
      </Box>
      <Box>操作类型：</Box>
      <Select size='small' className='w-200px'>
        <MenuItem disabled>
          <AccessTime />
          <span>暂无数据</span>
        </MenuItem>
      </Select>
      <Box>操作人：</Box>
      <TextField size='small' className='w-200px' />
    </Box>
    <Box className='flex-auto bg-white'>
      <Box className='overflow-auto text-[#000C25] border border-t border-l border-[#CECECE]'>
        <Box className='w-full overflow-auto bg-[#CDE6E3] h-39px leading-39px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'15%'}}>操作时间</Box>
          <Box sx={{width:'15%'}}>操作人</Box>
          <Box sx={{width:'20%'}}>操作类型</Box>
          <Box sx={{width:'25%'}}>操作位置</Box>
          <Box sx={{width:'25%'}}>操作详情</Box>
        </Box>
        <Box className='w-full bg-[#FFFFFF] h-56px leading-56px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'15%'}}>编号</Box>
          <Box sx={{width:'15%'}}>名称</Box>
          <Box sx={{width:'20%'}}>累计上料</Box>
          <Box sx={{width:'25%'}}>已消耗量</Box>
          <Box sx={{width:'25%'}}>欠料量</Box>
        </Box>
        <Box className='w-full bg-[#F2F9F8] h-56px leading-56px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'15%'}}>编号</Box>
          <Box sx={{width:'15%'}}>名称</Box>
          <Box sx={{width:'20%'}}>累计上料</Box>
          <Box sx={{width:'25%'}}>已消耗量</Box>
          <Box sx={{width:'25%'}}>欠料量</Box>
        </Box>
      </Box>
    </Box>
  </Box>
}

export default LogPage

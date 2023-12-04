import { ColorButton } from "@/components/CcolorButton.jsx"
import { RadioButtonUnchecked } from "@mui/icons-material"
import { Box, Button, ButtonBase } from "@mui/material"

const AndonPage = () => {
  return <div className="flex flex-col w-full h-full">
    <div className="flex-auto bg-white py-26px px-16px overflow-auto">
      <div className="flex justify-center items-center mb-24px">
        <Button className="h-48px" variant="outlined" size="large">
          <RadioButtonUnchecked />
          <span className="text-xl ml-8px">Andon触发</span>
        </Button>
        <div className="w-50px bg-[#CDE6E3] h-4px"></div>
        <Button className="h-48px" variant="outlined" size="large">
          <RadioButtonUnchecked />
          <span className="text-xl ml-8px">Andon处理</span>
        </Button>
        <div className="w-50px bg-[#CDE6E3] h-4px"></div>
        <Button className="h-48px" variant="outlined" size="large">
          <RadioButtonUnchecked />
          <span className="text-xl ml-8px">Andon关闭</span>
        </Button>
        <div className="w-50px bg-[#CDE6E3] h-4px"></div>
        <Button className="h-48px" variant="outlined" size="large">
          <RadioButtonUnchecked />
          <span className="text-xl ml-8px">Andon确认</span>
        </Button>
      </div>
      <div className="border-t border-l border-[#CECECE]">
        <Box className='w-full overflow-auto bg-[#CDE6E3] h-39px leading-39px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'10%'}}>安灯类型</Box>
          <Box sx={{width:'15%'}}>安灯定义</Box>
          <Box sx={{width:'15%'}}>触发工位</Box>
          <Box sx={{width:'10%'}}>触发人员</Box>
          <Box sx={{width:'20%'}}>触发时间</Box>
          <Box sx={{width:'10%'}}>持续时间</Box>
          <Box sx={{width:'10%'}}>状态</Box>
          <Box sx={{width:'10%'}}>操作</Box>
        </Box>
        <Box className='w-full bg-[#FFFFFF] h-56px leading-56px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'10%'}}>安灯类型</Box>
          <Box sx={{width:'15%'}}>安灯定义</Box>
          <Box sx={{width:'15%'}}>触发工位</Box>
          <Box sx={{width:'10%'}}>触发人员</Box>
          <Box sx={{width:'20%'}}>触发时间</Box>
          <Box sx={{width:'10%'}}>持续时间</Box>
          <Box sx={{width:'10%'}}>
            <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#fcdada',color:'#f04848'}}>待处理</ButtonBase>
          </Box>
          <Box sx={{width:'10%'}}>
            <Button variant="contained" className="w-80px h-32px"><span className="text-lg">处理</span></Button>
          </Box>
        </Box>
        <Box className='w-full bg-[#F2F9F8] h-56px leading-56px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'10%'}}>安灯类型</Box>
          <Box sx={{width:'15%'}}>安灯定义</Box>
          <Box sx={{width:'15%'}}>触发工位</Box>
          <Box sx={{width:'10%'}}>触发人员</Box>
          <Box sx={{width:'20%'}}>触发时间</Box>
          <Box sx={{width:'10%'}}>持续时间</Box>
          <Box sx={{width:'10%'}}>
            <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#F5E7C7',color:'#FF9900'}}>待关闭</ButtonBase>
          </Box>
          <Box sx={{width:'10%'}}>
            <Button variant="outlined" className="w-80px h-32px"><span className="text-lg">关闭</span></Button>
          </Box>
        </Box>
        <Box className='w-full bg-[#FFFFFF] h-56px leading-56px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'10%'}}>安灯类型</Box>
          <Box sx={{width:'15%'}}>安灯定义</Box>
          <Box sx={{width:'15%'}}>触发工位</Box>
          <Box sx={{width:'10%'}}>触发人员</Box>
          <Box sx={{width:'20%'}}>触发时间</Box>
          <Box sx={{width:'10%'}}>持续时间</Box>
          <Box sx={{width:'10%'}}>
            <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#CDE6E3',color:'#058373'}}>已完结</ButtonBase>
          </Box>
          <Box sx={{width:'10%'}}>-</Box>
        </Box>
        <Box className='w-full bg-[#F2F9F8] h-56px leading-56px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'10%'}}>安灯类型</Box>
          <Box sx={{width:'15%'}}>安灯定义</Box>
          <Box sx={{width:'15%'}}>触发工位</Box>
          <Box sx={{width:'10%'}}>触发人员</Box>
          <Box sx={{width:'20%'}}>触发时间</Box>
          <Box sx={{width:'10%'}}>持续时间</Box>
          <Box sx={{width:'10%'}}>
            <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#D1DDFA',color:'#4D69FF'}}>待确认</ButtonBase>
          </Box>
          <Box sx={{width:'10%'}}>
            <Button variant="outlined" className="w-80px h-32px"><span className="text-lg">确认</span></Button>
          </Box>
        </Box>
      </div>
    </div>
    <div className="w-full h-98px bg-white mt-16px flex items-center overflow-auto px-16px">
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px'}}>设备</ColorButton>
      <ColorButton ccolor='#058373' sx={{height:'72px',marginRight:'auto'}}>设备</ColorButton>
    </div>
  </div>
}

export default AndonPage

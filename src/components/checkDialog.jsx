import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { Close } from "@mui/icons-material"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import { useState } from "react"
import { useEffect } from "react"

export const CheckDialog = ({ open, onClose, equipment, onConfirm }) => {
  const { config } = useConfigStore()
  const api = useApi(config.serveUrl)

  const [checkItem, setCheckItem] = useState([])

  useEffect(() => {
    api().GetEquipmentCheckItem({
      EquipmentGuid: equipment.EquipmentGuid,
    }).then((res) => {
      if(res.code === 0) {
        setCheckItem(res.data.map((c) => ({
          ...c,
          Value: '',
          Result: '合格',
        })))
      }
    })
  }, [])

  const changeByKey = (gid, key, value) => {
    console.log({gid, key, value})
    const target = checkItem.find((c) => c.OrdercaGuid === gid)
    target[key] = value
    setCheckItem([...checkItem])
  }

  const onApplyCheck = () => {
    const target = checkItem.find((c) => c.Value === '')
    if(target !== undefined) {
      enqueueSnackbar('请完成所有点检', { variant: 'warning' })
      return
    }

    api().EquipmentCheck(checkItem).then((res) => {
      if(res.code === 0) {
        onConfirm()
      }
    })
  }

  return <Dialog open={open} maxWidth='1064px' onClose={onClose} scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>设备点检</p>
      <IconButton onClick={onClose}><Close /></IconButton>
    </DialogTitle>
    <DialogContent className="w-1064px mt-24px">
      <div className="flex items-center text-2xl text-[#000c25]">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#000C25" fillRule="nonzero" d="M16.002 1.333c3.418 0 6.836 1.42 9.3 4.257 4.177 4.812 3.769 12.078-.537 16.724l-.33.343-7.676 7.696a1.064 1.064 0 0 1-.62.305l-.137.009c-.219 0-.438-.067-.624-.201l-.133-.113-7.675-7.696C2.957 18.033 2.42 10.522 6.703 5.59a12.26 12.26 0 0 1 8.905-4.25l.394-.007M16.022 4l-.33.006a9.592 9.592 0 0 0-6.975 3.333c-3.298 3.798-2.96 9.727.74 13.436l6.544 6.56 6.512-6.525.296-.308c3.462-3.735 3.688-9.467.479-13.163a9.594 9.594 0 0 0-6.967-3.333L16.022 4M16 8a5.334 5.334 0 1 1 0 10.667A5.334 5.334 0 0 1 16 8m0 2.667A2.667 2.667 0 1 0 16 16a2.667 2.667 0 0 0 0-5.333"/></svg>
        {/* <p className="mx-16px">工位A1</p>
        <Divider orientation="vertical" sx={{height:'33px'}} /> */}
        <p className="ml-16px">{equipment.EquipmentName}</p>
      </div>
      <Box className='border border-[#CECECE] mt-17px'>
        <Box className='w-full overflow-auto bg-[#CDE6E3] py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'10%'}}>序号</Box>
          <Box sx={{width:'10%'}}>部位</Box>
          <Box sx={{width:'10%'}}>方法</Box>
          <Box sx={{width:'15%'}}>要求</Box>
          <Box sx={{width:'20%'}}>标准</Box>
          <Box sx={{width:'15%'}}>实测值</Box>
          <Box sx={{width:'20%'}}>检验结果</Box>
        </Box>
        {
          checkItem.map((c, i) => {
            return <Box key={c.OrdercaGuid} className={['w-full py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px', ['bg-[#FFFFFF]','bg-[#F2F9F8]'][i%2]].join(' ')}>
              <Box sx={{width:'10%'}}>{i+1}</Box>
              <Box sx={{width:'10%'}}>{c.Name}</Box>
              <Box sx={{width:'10%'}}>{c.Method}</Box>
              <Box sx={{width:'15%'}}>{c.Request}</Box>
              <Box sx={{width:'20%'}}>{c.StandardValue}</Box>
              <Box sx={{width:'15%',padding:'0'}}>
                <input type="number" value={c.Value} onChange={(e) => changeByKey(c.OrdercaGuid, 'Value', e.target.value)} className="w-full h-full text-lg text-[#000c25] px-16px bg-transparent"></input>
              </Box>
              <Box sx={{width:'20%'}} className='flex items-center'>
                <IconButton onClick={() => changeByKey(c.OrdercaGuid, 'Result', '合格')}>
                  {
                    c.Result === '合格'
                    ?
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33"><path fill="#058373" fillRule="evenodd" d="M15.873 1.41h.318c8.066.103 14.52 6.703 14.476 14.755-.06 8.067-6.6 14.579-14.667 14.579-8.096-.015-14.652-6.57-14.667-14.667v-.293C1.495 7.717 8.124 1.308 16.191 1.41Zm6.247 8.774-8.787 8.786-3.453-3.44L8 17.41l5.333 5.334L24 12.077l-1.88-1.893"/></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33"><path fill="#CECECE" fillRule="nonzero" d="M16 2.077c7.732 0 14 6.268 14 14s-6.268 14-14 14-14-6.268-14-14 6.268-14 14-14m0 2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12"/></svg>
                  }
                </IconButton>
                <IconButton onClick={() => changeByKey(c.OrdercaGuid, 'Result', '不合格')}>
                  {
                    c.Result === '不合格'
                    ?
                    <svg  xmlns="http://www.w3.org/2000/svg" width="32" height="33"><path fill="#F04848" fillRule="evenodd" d="M10.53 2.466c5.44-2.185 11.689-.924 15.84 3.242a14.639 14.639 0 0 1 3.182 15.986c-2.259 5.486-7.612 9.05-13.552 9.05-3.887 0-7.627-1.54-10.37-4.283a14.687 14.687 0 0 1-4.297-10.384v-.293A14.679 14.679 0 0 1 10.53 2.466Zm8.923 8.28L16 14.198l-3.453-3.454-1.88 1.88 3.453 3.454-3.453 3.453 1.88 1.88L16 17.959l3.453 3.453 1.88-1.88-3.453-3.453 3.453-3.454-1.88-1.88"/></svg>
                    :
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33"><path fill="#CECECE" fillRule="nonzero" d="M16 2.077c7.732 0 14 6.268 14 14s-6.268 14-14 14-14-6.268-14-14 6.268-14 14-14m0 2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12"/></svg>
                  }
                </IconButton>
              </Box>
            </Box>
          })
        }
        {/* <Box className='w-full bg-[#FFFFFF] h-72px leading-72px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'10%'}}>序号</Box>
          <Box sx={{width:'10%'}}>部位</Box>
          <Box sx={{width:'10%'}}>方法</Box>
          <Box sx={{width:'15%'}}>要求</Box>
          <Box sx={{width:'20%'}}>标准</Box>
          <Box sx={{width:'15%',padding:'0'}}>
            <input type="number" className="w-full h-full text-lg text-[#000c25] px-16px bg-transparent"></input>
          </Box>
          <Box sx={{width:'20%'}} className='flex items-center'>
            <svg className="mr-32px" xmlns="http://www.w3.org/2000/svg" width="32" height="33"><path fill="#058373" fillRule="evenodd" d="M15.873 1.41h.318c8.066.103 14.52 6.703 14.476 14.755-.06 8.067-6.6 14.579-14.667 14.579-8.096-.015-14.652-6.57-14.667-14.667v-.293C1.495 7.717 8.124 1.308 16.191 1.41Zm6.247 8.774-8.787 8.786-3.453-3.44L8 17.41l5.333 5.334L24 12.077l-1.88-1.893"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33"><path fill="#CECECE" fillRule="nonzero" d="M16 2.077c7.732 0 14 6.268 14 14s-6.268 14-14 14-14-6.268-14-14 6.268-14 14-14m0 2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12"/></svg>
          </Box>
        </Box>
        <Box className='w-full bg-[#F2F9F8] h-72px leading-72px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'10%'}}>序号</Box>
          <Box sx={{width:'10%'}}>部位</Box>
          <Box sx={{width:'10%'}}>方法</Box>
          <Box sx={{width:'15%'}}>要求</Box>
          <Box sx={{width:'20%'}}>标准</Box>
          <Box sx={{width:'15%',padding:'0'}}>
            <input type="number" className="w-full h-full text-lg text-[#000c25] px-16px bg-transparent"></input>
          </Box>
          <Box sx={{width:'20%'}} className='flex items-center'>
            <svg className="mr-32px" xmlns="http://www.w3.org/2000/svg" width="32" height="33"><path fill="#F04848" fillRule="evenodd" d="M10.53 2.466c5.44-2.185 11.689-.924 15.84 3.242a14.639 14.639 0 0 1 3.182 15.986c-2.259 5.486-7.612 9.05-13.552 9.05-3.887 0-7.627-1.54-10.37-4.283a14.687 14.687 0 0 1-4.297-10.384v-.293A14.679 14.679 0 0 1 10.53 2.466Zm8.923 8.28L16 14.198l-3.453-3.454-1.88 1.88 3.453 3.454-3.453 3.453 1.88 1.88L16 17.959l3.453 3.453 1.88-1.88-3.453-3.453 3.453-3.454-1.88-1.88"/></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="33"><path fill="#CECECE" fillRule="nonzero" d="M16 2.077c7.732 0 14 6.268 14 14s-6.268 14-14 14-14-6.268-14-14 6.268-14 14-14m0 2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12"/></svg>
          </Box>
        </Box> */}
      </Box>
    </DialogContent>
    <DialogActions style={{justifyContent:'center'}}>
      <Button onClick={onApplyCheck} className="w-144px h-56px" variant="contained"><span className="text-2xl text-white">确认</span></Button>
      <Button className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}} onClick={onClose}><span className="text-2xl text-[#646A73]">取消</span></Button>
    </DialogActions>
  </Dialog>
}

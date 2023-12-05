import { Close } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, OutlinedInput } from "@mui/material"
import { useState } from "react"

export const JobNumDialog = ({ open, onClose, onConfirm }) => {
  const [jobNum, setJobNum] = useState('')

  return <Dialog open={open} onClose={onClose}>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>人员操作</p>
      <IconButton onClick={onClose}><Close/></IconButton>
    </DialogTitle>
    <DialogContent className="w-320px">
      <OutlinedInput value={jobNum} onChange={(e) => setJobNum(e.target.value)} fullWidth className="mt-56px" placeholder='请输入您的工号' endAdornment={<IconButton><svg className="flex-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M22 15a1 1 0 0 1 1 1v4a3 3 0 0 1-3 3h-4a1 1 0 0 1 0-2h4a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1M2 15a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 1 0 2H4a3 3 0 0 1-3-3v-4a1 1 0 0 1 1-1m21-4v2H1v-2zM20 1a3 3 0 0 1 3 3v4a1 1 0 0 1-2 0V4a1 1 0 0 0-1-1h-4a1 1 0 0 1 0-2zM8 1a1 1 0 1 1 0 2H4a1 1 0 0 0-1 1v4a1 1 0 1 1-2 0V4a3 3 0 0 1 3-3z"/></svg></IconButton>} />
    </DialogContent>
    <DialogActions style={{justifyContent:'center'}}>
      <Button disabled={jobNum===''} className="w-144px h-56px" variant="contained" onClick={() => onConfirm(jobNum)}><span className="text-2xl text-white">确认</span></Button>
      <Button className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}} onClick={onClose}><span className="text-2xl text-[#646A73]">取消</span></Button>
    </DialogActions>
  </Dialog>
}
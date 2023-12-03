import { Close } from "@mui/icons-material"
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Input } from "@mui/material"
import { forwardRef } from "react"
import { useImperativeHandle } from "react"
import { useState } from "react"

export const AdjustDialog = forwardRef((_, ref) => {
  const [open, setOpen] = useState(false)

  useImperativeHandle(ref, () => {
    return {
      open: () => {
        setOpen(true)
      }
    }
  })

  return <Dialog open={open} maxWidth='632px' onClose={() => setOpen(false)} scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>调机</p>
      <IconButton onClick={() => setOpen(false)}><Close /></IconButton>
    </DialogTitle>
    <DialogContent className="w-632px">
      <div className="flex items-center mt-24px">
        <img src="https://res.d2mcloud.com/common/logo.png" className="w-88px h-60px object-cover" />
        <div className="ml-21px flex-auto">
          <div className="flex justify-between items-center text-lg text-[#000C25]">
            <p>SB091029090/CNC数控机床</p>
            <Button variant="contained" size="small" color="error" style={{backgroundColor:'#FCDADA',borderRadius:'0'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill="#F04848" fillRule="evenodd" d="M10.12.833c5.04.065 9.074 4.19 9.047 9.222-.037 5.042-4.125 9.112-9.167 9.112A9.182 9.182 0 0 1 .833 10v-.183A9.164 9.164 0 0 1 10.12.833m.713 11.25H9.167v1.667h1.666zm0-5.833H9.167v4.167h1.666z"/></svg>
              <p className="text-[#F04848] ml-4px">待调机</p>
            </Button>
          </div>
          <div className="flex text-lg text-[#646A73] mt-10px">
            <p className="mr-40px">设备类别：数控机床</p>
            <p>设备型号：XH091090190</p>
          </div>
        </div>
      </div>
      <div className="flex items-center mt-28px">
        <Input placeholder="请输入" className="w-344px h-56px px-16px py-12px border" endAdornment={<IconButton><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M29.333 20c.737 0 1.334.597 1.334 1.333v5.334a4 4 0 0 1-4 4h-5.334a1.333 1.333 0 0 1 0-2.667h5.334c.736 0 1.333-.597 1.333-1.333v-5.334c0-.736.597-1.333 1.333-1.333M2.667 20C3.403 20 4 20.597 4 21.333v5.334C4 27.403 4.597 28 5.333 28h5.334a1.333 1.333 0 0 1 0 2.667H5.333a4 4 0 0 1-4-4v-5.334c0-.736.597-1.333 1.334-1.333m28-5.333v2.666H1.333v-2.666zm-4-13.334a4 4 0 0 1 4 4v5.334a1.333 1.333 0 0 1-2.667 0V5.333C28 4.597 27.403 4 26.667 4h-5.334a1.333 1.333 0 0 1 0-2.667zm-16 0a1.333 1.333 0 0 1 0 2.667H5.333C4.597 4 4 4.597 4 5.333v5.334a1.333 1.333 0 0 1-2.667 0V5.333a4 4 0 0 1 4-4z"/></svg></IconButton>} />
        <Button variant="outlined" className="h-56px !mx-16px"><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38"><path fill="#058373" fill-rule="nonzero" d="M33 6.556a3.111 3.111 0 0 1 3.111 3.11v18.667A3.111 3.111 0 0 1 33 31.444H5a3.111 3.111 0 0 1-3.111-3.11V9.666A3.111 3.111 0 0 1 5 6.556zm0 3.11H5v18.667h28zM25.79 22.96v3.394H12.214V22.96zm-5.091-5.091v3.394h-3.394v-3.394zm-5.09 0v3.394h-3.395v-3.394zm-5.092 0v3.394H7.123v-3.394zm15.273 0v3.394h-3.394v-3.394zm5.09 0v3.394h-3.393v-3.394zM20.7 12.778v3.394h-3.394v-3.394zm-5.09 0v3.394h-3.395v-3.394zm-5.092 0v3.394H7.123v-3.394zm15.273 0v3.394h-3.394v-3.394zm5.09 0v3.394h-3.393v-3.394z"/></svg></Button>
        <Button variant="contained" size="large" className="w-152px h-56px"><p className="text-2xl">确定</p></Button>
      </div>
    </DialogContent>
  </Dialog>
})

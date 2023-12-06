import { Close } from "@mui/icons-material"
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton } from "@mui/material"
import { useState } from "react"

export const StationsDialog = ({ open, onClose, onConfirm, stations }) => {
  const [stationGuid, setStationGuid] = useState('')

  const onSelect = (station) => {
    setStationGuid(station.WorkstationGuid)
  }

  return <Dialog open={open} maxWidth='880px' onClose={onClose} scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>工位</p>
      <IconButton onClick={onClose}><Close /></IconButton>
    </DialogTitle>
    <DialogContent className="w-880px" sx={{marginTop:'16px'}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="mr-4" width="24" height="24"><path fill="#646A73" fillRule="evenodd" d="M12 1c6.072 0 11 4.928 11 11-.011 6.072-4.928 10.989-11 11-6.072 0-11-4.928-11-11S5.928 1 12 1m0 2c-4.967 0-9 4.033-9 9s4.033 9 8.996 9c4.97-.009 8.995-4.033 9.004-9 0-4.967-4.033-9-9-9m1.01 7.99L13 15h1.01v2h-3.02v-4h-1v-2.01h3.02m0-3.99v2.02h-2.02V7h2.02"/></svg>
            <span className="text-[#646A73]">请选择所在的工位</span>
          </div>
        </Grid>
        {
          stations.map((s) => {
            return <Grid item xs={4} key={s.WorkstationGuid}>
              <div onClick={() => onSelect(s)} className={["h-180px border px-24px py-18px", stationGuid === s.WorkstationGuid?'border-[#058373] bg-#F2F9F8':' border-[#CECECE]'].join(' ')}>
                <IconButton><svg className="flex-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M14 1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4v1.014h6V9a1 1 0 0 1 2 0v1.014h1V7a1 1 0 0 1 2 0v3.014h.131a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5.05a2 2 0 0 1-2-2v-5.57H7.906v5.57a2 2 0 0 1-2 2H3.131a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2H8V9H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm7.131 11.015h-18v9h2.775v-7.57h10.175v7.57h5.05v-9M14 3H4v4h10z"/></svg></IconButton>
                <div className="text-lg text-[#000C25]">{s.WorkstationName}</div>
              </div>
            </Grid>
          })
        }
      </Grid>
    </DialogContent>
    <DialogActions style={{justifyContent:'center'}}>
      <Button disabled={stationGuid===''} className="w-144px h-56px" variant="contained" onClick={() => onConfirm(stationGuid)}><span className="text-2xl text-white">确认</span></Button>
      <Button className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}} onClick={onClose}><span className="text-2xl text-[#646A73]">取消</span></Button>
    </DialogActions>
  </Dialog>
}

import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { Close } from "@mui/icons-material"
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Input } from "@mui/material"

export const AdjustDialog = ({ open, onClose, equipment, onConfirm }) => {
  const { config } = useConfigStore()
  const api = useApi(config.serveUrl)

  const debugEquipment = () => {
    api().EquipmentDebug({
      EquipmentGuid: equipment.EquipmentDebug,
    }).then((res) => {
      if(res.code === 0) {
        onConfirm()
      }
    })
  }

  return <Dialog open={open} maxWidth='632px' onClose={onClose} scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>调机</p>
      <IconButton onClick={onClose}><Close /></IconButton>
    </DialogTitle>
    <DialogContent className="w-632px">
      <div className="flex items-center mt-24px">
        <img src="https://res.d2mcloud.com/common/logo.png" className="w-88px h-60px object-cover" />
        <div className="ml-21px flex-auto">
          <div className="flex justify-between items-center text-lg text-[#000C25]">
            <p>{equipment.EquipmentCode}/{equipment.EquipmentName}</p>
            {
              equipment.DebugState === '待调机'
              ?
              <Button variant="contained" size="small" color="error" style={{backgroundColor:'#FCDADA',borderRadius:'0'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill="#F04848" fillRule="evenodd" d="M10.12.833c5.04.065 9.074 4.19 9.047 9.222-.037 5.042-4.125 9.112-9.167 9.112A9.182 9.182 0 0 1 .833 10v-.183A9.164 9.164 0 0 1 10.12.833m.713 11.25H9.167v1.667h1.666zm0-5.833H9.167v4.167h1.666z"/></svg>
                <p className="text-[#F04848] ml-4px">待调机</p>
              </Button>
              :
              <Button variant="contained" size="small" color="error" style={{backgroundColor:'#CDE6E3',borderRadius:'0'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill="#058373" fillRule="evenodd" d="M10.12.833c5.04.065 9.074 4.19 9.047 9.222-.037 5.042-4.125 9.112-9.167 9.112A9.182 9.182 0 0 1 .833 10v-.183A9.164 9.164 0 0 1 10.12.833m3.705 5.484-5.492 5.491-2.158-2.15L5 10.833l3.333 3.334L15 7.5z"/></svg>
                <p className="text-[#058373] ml-4px">已调机</p>
              </Button>
            }
          </div>
          <div className="flex text-lg text-[#646A73] mt-10px">
            <p className="mr-40px">设备类别：{equipment.EquipmentTypeName}</p>
            <p>设备型号：{equipment.EquipmentSpec}</p>
          </div>
        </div>
      </div>
      {/* <div className="flex items-center mt-28px">
        <Input placeholder="请输入" className="w-344px h-56px px-16px py-12px border" endAdornment={<IconButton><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M29.333 20c.737 0 1.334.597 1.334 1.333v5.334a4 4 0 0 1-4 4h-5.334a1.333 1.333 0 0 1 0-2.667h5.334c.736 0 1.333-.597 1.333-1.333v-5.334c0-.736.597-1.333 1.333-1.333M2.667 20C3.403 20 4 20.597 4 21.333v5.334C4 27.403 4.597 28 5.333 28h5.334a1.333 1.333 0 0 1 0 2.667H5.333a4 4 0 0 1-4-4v-5.334c0-.736.597-1.333 1.334-1.333m28-5.333v2.666H1.333v-2.666zm-4-13.334a4 4 0 0 1 4 4v5.334a1.333 1.333 0 0 1-2.667 0V5.333C28 4.597 27.403 4 26.667 4h-5.334a1.333 1.333 0 0 1 0-2.667zm-16 0a1.333 1.333 0 0 1 0 2.667H5.333C4.597 4 4 4.597 4 5.333v5.334a1.333 1.333 0 0 1-2.667 0V5.333a4 4 0 0 1 4-4z"/></svg></IconButton>} />
        <Button variant="outlined" className="h-56px !mx-16px"><svg xmlns="http://www.w3.org/2000/svg" width="38" height="38"><path fill="#058373" fillRule="nonzero" d="M33 6.556a3.111 3.111 0 0 1 3.111 3.11v18.667A3.111 3.111 0 0 1 33 31.444H5a3.111 3.111 0 0 1-3.111-3.11V9.666A3.111 3.111 0 0 1 5 6.556zm0 3.11H5v18.667h28zM25.79 22.96v3.394H12.214V22.96zm-5.091-5.091v3.394h-3.394v-3.394zm-5.09 0v3.394h-3.395v-3.394zm-5.092 0v3.394H7.123v-3.394zm15.273 0v3.394h-3.394v-3.394zm5.09 0v3.394h-3.393v-3.394zM20.7 12.778v3.394h-3.394v-3.394zm-5.09 0v3.394h-3.395v-3.394zm-5.092 0v3.394H7.123v-3.394zm15.273 0v3.394h-3.394v-3.394zm5.09 0v3.394h-3.393v-3.394z"/></svg></Button>
        <Button variant="contained" size="large" className="w-152px h-56px"><p className="text-2xl">确定</p></Button>
      </div>
      <div className="mt-24px flex items-center text-[#646A73]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#646A73" fillRule="evenodd" d="M12 1c6.072 0 11 4.928 11 11-.011 6.072-4.928 10.989-11 11-6.072 0-11-4.928-11-11S5.928 1 12 1m0 2c-4.967 0-9 4.033-9 9s4.033 9 8.996 9c4.97-.009 8.995-4.033 9.004-9 0-4.967-4.033-9-9-9m1.01 7.99L13 15h1.01v2h-3.02v-4h-1v-2.01h3.02m0-3.99v2.02h-2.02V7h2.02"/></svg>
        <span className="ml-8px">扫工装二维码，检查工装！</span>
      </div>
      <div className="mt-9px border-t border-l border-[#CECECE]">
        <div className="px-16px py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px bg-[#F3F9F8] py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px bg-[#F3F9F8] py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px bg-[#F3F9F8] py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px bg-[#F3F9F8] py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px bg-[#F3F9F8] py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
        <div className="px-16px bg-[#F3F9F8] py-12px flex justify-between items-center border-b border-r border-[#CECECE] text-[#000C25]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M20 1a3 3 0 0 1 1 5.829v10.342a3.001 3.001 0 1 1-3.829 3.83H6.829A3.001 3.001 0 1 1 3 17.17V6.829a3.001 3.001 0 1 1 2 0v10.342a3.008 3.008 0 0 1 1.83 1.83L12 19l-5.196-3v-6L12 7l5.196 3v6L12 19h5.17A3.008 3.008 0 0 1 19 17.17V6.83A3.008 3.008 0 0 1 17.17 5h-4.14l.497.49-1.401 1.426-2.242-2.203-.712-.699.698-.713 2.241-2.293 1.43 1.398L12.96 3h4.21A3.001 3.001 0 0 1 20 1M4 19a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2M8.803 12.369v2.475L11 16.112v-2.545l-2.197-1.198m6.393-.001L13 13.587v2.525l2.196-1.268v-2.476M12 9.309l-2.25 1.299 2.269 1.237 2.229-1.238zM4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2m16 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2"/></svg>
          <p className="w-144px">XH091090190</p>
          <p className="w-144px">叉叉刀具</p>
          <p className="w-160px">详情内容</p>
          <Checkbox />
        </div>
      </div> */}
    </DialogContent>
    <DialogActions style={{justifyContent:'center'}}>
      <Button onClick={() => debugEquipment()} className="w-144px h-56px" variant="contained"><span className="text-2xl text-white">确认</span></Button>
      <Button className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}} onClick={onClose}><span className="text-2xl text-[#646A73]">取消</span></Button>
    </DialogActions>
  </Dialog>
}

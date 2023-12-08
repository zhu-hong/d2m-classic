import { Footer } from "@/components/footer.jsx"
import { Header } from "@/components/header.jsx"
import { ScanFlow } from "@/components/scanFlow.jsx"
import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { Box, Button } from "@mui/material"
import { useRef } from "react"
import { useEffect } from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { Outlet } from "react-router-dom"

let startDrag = false
let startY = 0
let base = 0
let target = null

const onPointerDown = (e) => {
  startDrag = true
  startY = e.clientY
  target = e.currentTarget
  base = parseInt(target.style.bottom)
}
const onPointerUp = () => {
  if(!startDrag) return
  startDrag = false
  localStorage.setItem('bottomInstance', parseInt(target.style.bottom))
}
const onPointerMove = (e) => {
  if(!startDrag) return

  const distance = e.clientY - startY

  let bottom = base - distance

  if(bottom < 0) {
    bottom = 0
  } else if(bottom > window.innerHeight - target.clientHeight) {
    bottom = window.innerHeight - target.clientHeight
  }
  
  target.style.bottom = bottom + 'px'
}

const OperatePage = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [scanOpen, setScanOpen] = useState(false)

  const floatButton = useRef()
  const [bottom, setBottom] = useState(250)

  const { config, setWorkcenters, setWorkstations } = useConfigStore()
  const api = useApi(config.serveUrl)

  useEffect(() => {
    const bottomInstance = localStorage.getItem('bottomInstance')
    if(bottomInstance !== null) {
      setBottom(Number(bottomInstance))
    }

    const t = setInterval(() => {
      api().GetMachineDetail({
        MachineGuid: config.MachineGuid,
      }).then((res) => {
        if(res.code === 0) {
          const { Workcenters, Workstations } = res
          setWorkcenters(Workcenters)
          setWorkstations(Workstations.filter((w) => w.WorkcenterGuid === config.terminalInfo.WorkcenterGuid))
        }
      })
    }, 5000)

    return () => clearInterval(t)
  }, [])

  return <Box component='main' className='h-full flex flex-col relative' onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onPointerMove={onPointerMove}>
    <Header actions={[
      <Button key='action-quit' className="w-64px h-64px" onClick={() => navigate('/')}>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#FFF" fillRule="evenodd" d="M4 1.333A2.657 2.657 0 0 0 1.333 4v24A2.657 2.657 0 0 0 4 30.667h12A2.657 2.657 0 0 0 18.667 28v-8H16v8H4V4h12v8h2.667V4A2.657 2.657 0 0 0 16 1.333Zm20 9.334v4H9.333v2.666H24v4L30.667 16 24 10.667" /></svg>
      </Button>
    ]} />
    <Box className="flex-auto overflow-hidden flex">
      <Box className='w-80px bg-[#044244] flex flex-col justify-between items-center'>
        <Button onClick={() => navigate('/op')} variant={location.pathname==='/op'?'contained':''} className="w-80px h-96px">
          <Box className='flex flex-col justify-center items-center text-white text-lg font-medium'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="#FFF" fillRule="evenodd"><path fill="none" d="M0 0h24v24H0z"/><path fillRule="nonzero" d="M22.88 12.172a2 2 0 0 1 .12.683V21a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-8.145a2 2 0 0 1 2.683-1.88L12 14l8.317-3.024a2 2 0 0 1 2.563 1.196m-1.88.683-9 3.273-9-3.273V21h18v-8.145M18 1a2 2 0 0 1 2 2v8.09l-2 .727V3H6v8.817l-2-.727V3a2 2 0 0 1 2-2zm-2.5 8v2h-7V9zm0-4v2h-7V5z"/></g></svg>
            <span className="mt-4px">任务</span>
          </Box>
        </Button>
        <Button onClick={() => navigate('/op/process')} variant={location.pathname==='/op/process'?'contained':''} className="w-80px h-96px">
          <Box className='flex flex-col justify-center items-center text-white text-lg font-medium'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25"><path fill="#FFF" d="M14.487 1.213c.949 0 1.668.719 1.668 1.669V4.6l.308.164 1.534-.955c.751-.374 1.601-.175 2.118.48l.093.128.037.059 2.56 4.479c.211.411.254.867.113 1.28a1.551 1.551 0 0 1-.862.92l-1.42.835v.703a1.048 1.048 0 0 1-2.097.003l.045-1.841 2.131-1.334-2.082-3.648-2.122 1.328-.107-.001-.51-.34-.167-.106-.193-.113-.374-.199-1.043-.525-.055-.089V3.304H9.94v2.802l-.075.096-.717.18c-.157.04-.328.13-.606.31l-.944.633-.108.001-2.173-1.36-2.031 3.556 2.179 1.417-.047 2.628L3.286 14.9l2.081 3.647L7.49 17.22l.108.002.509.34.167.106.305.173.262.138 1.044.526.055.088v2.526h2.064c.54 0 .983.406 1.04.932l.006.114c0 .58-.47 1.048-1.048 1.048h-2.49c-.949 0-1.668-.719-1.668-1.668v-1.723l-.308-.163-1.534.956c-.75.374-1.601.175-2.118-.48l-.093-.128-.036-.059-2.559-4.481a1.639 1.639 0 0 1-.113-1.28c.143-.415.458-.747.863-.92l1.423-.835.046-.358-1.455-.912a1.565 1.565 0 0 1-.877-.927c-.16-.464-.087-.984.198-1.429l2.463-4.311a1.53 1.53 0 0 1 .96-.753 1.733 1.733 0 0 1 1.408.257l1.394.872.18-.108.157-.09.001-1.791c0-.9.645-1.593 1.52-1.663l.148-.006Zm7.427 19.93a.992.992 0 0 1 0 1.982h-5.947a.992.992 0 0 1 0-1.983h5.947m0-4.958a.992.992 0 1 1 0 1.983h-5.947a.992.992 0 0 1 0-1.983h5.947M12 8.418a3.791 3.791 0 1 1-.002 7.583A3.791 3.791 0 0 1 12 8.418m0 1.983a1.809 1.809 0 1 0 0 3.617 1.809 1.809 0 0 0 0-3.617"/></svg>
            <span className="mt-4px">生产</span>
          </Box>
        </Button>
        <Button onClick={() => navigate('/op/machine')} variant={location.pathname==='/op/machine'?'contained':''} className="w-80px h-96px">
          <Box className='flex flex-col justify-center items-center text-white text-lg font-medium'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#FFF" fillRule="nonzero" d="M20.687 3C21.436 3 22 3.585 22 4.361v16.277c0 .777-.565 1.362-1.313 1.362H3.313C2.565 22 2 21.415 2 20.638V4.361C2 3.585 2.565 3 3.313 3ZM20 16H4v4h16zm-7 1v2H5v-2zm6 0v2h-4v-2zm1.004-12h-16v9h16V5M9.996 6.39l2.96 4.27 1.837-2.732c.328-.487 1.164-.532 1.578-.115l.069.078 1.02 1.332H19v1.515h-2.071c-.331 0-.638-.137-.81-.362l-.436-.568-1.878 2.793c-.336.499-1.2.53-1.601.09l-.066-.082L9.14 8.287l-1.524 2.077c-.152.206-.415.341-.708.369l-.111.005H5V9.224h1.253l2.093-2.85c.372-.506 1.294-.497 1.65.017"/></svg>
            <span className="mt-4px">设备</span>
          </Box>
        </Button>
        {/* <Button onClick={() => navigate('/op/log')} variant={location.pathname==='/op/log'?'contained':''} className="w-80px h-96px">
          <Box className='flex flex-col justify-center items-center text-white text-lg font-medium'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#FFF" fillRule="nonzero" d="M20.095 2c1.558 0 2.812 1.259 2.9 2.825L23 5v8.683a6 6 0 0 1-8.322 8.314L14.62 22H3.905c-1.558 0-2.812-1.259-2.9-2.825L1 19V5c0-1.587 1.199-2.903 2.733-2.995L3.905 2h16.19M18 13a4 4 0 1 0 0 8 4 4 0 0 0 0-8m2.095-9H3.905c-.454 0-.845.377-.899.881L3 5v14c0 .523.359.937.801.993l.104.007 8.898.001a6 6 0 0 1 8.198-8.198L21 5c0-.523-.359-.937-.801-.993L20.095 4M19 14v2h2v2h-4v-4zM9 15v2H5v-2zm2-4v2H5v-2zm4-4v2H5V7z"/></svg>
            <span className="mt-4px">日志</span>
          </Box>
        </Button> */}
        <Box sx={{flex:'auto'}}></Box>
        <Button onClick={() => navigate('/op/andon')} variant={location.pathname==='/op/andon'?'contained':''} className="w-80px h-96px">
          <Box className='flex flex-col justify-center items-center text-white text-lg font-medium'>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><g fill="none" fillRule="evenodd"><path d="M0 0h24v24H0z"/><path fill="#FFF" fillRule="nonzero" d="M5.874.102c3.438 0 5.448 3.283 4.574 6.205-.305 1.019-.885 1.73-1.742 2.343l-.466.311-.453.295-.202.146c-.128.375.171 1.138 1.054 2.302l.282.362c.15.186.313.382.49.587l.375.422.201.22c.15.162.297.317.44.466l.418.424c1.424 1.41 2.45 2.065 3.038 2.097h.058c0-.012.005-.019.01-.027l.068-.089.607-.877c1.11-1.529 2.494-2.186 4.596-1.606 2.838.783 3.876 3.119 3.084 6.54a1 1 0 0 1-1.948-.451c.57-2.463.023-3.694-1.668-4.16-1.205-.333-1.785-.058-2.446.852l-.52.754-.137.191-.051.067c-.341.425-.698.697-1.191.775-1.554.245-3.372-.942-5.827-3.599-2.382-2.578-3.309-4.398-2.848-5.857.14-.443.406-.758.817-1.067l.215-.153.769-.502.07-.05c.525-.375.828-.746.99-1.29.515-1.718-.657-3.631-2.657-3.631-1.225 0-2.517.982-3.041 2.584-.704 2.152-.06 5.141 2.293 8.74 3.494 5.348 8.273 8.05 14.434 8.169a1 1 0 1 1-.04 2c-6.827-.133-12.216-3.179-16.069-9.075C.794 10.453.018 6.858.932 4.064 1.719 1.657 3.765.102 5.874.102ZM14 4.556A5.444 5.444 0 0 1 19.444 10a1 1 0 1 1-2 0A3.444 3.444 0 0 0 14 6.556a1 1 0 0 1 0-2M14 1a9 9 0 0 1 9 9 1 1 0 0 1-2 0 7 7 0 0 0-7-7 1 1 0 0 1 0-2"/></g></svg>
            <span className="mt-4px">呼叫</span>
          </Box>
        </Button>
      </Box>
      <Box className='flex-auto bg-[#DAE6E5] p-16px overflow-auto relative'>
        <Outlet />
      </Box>
      <Box className='w-24px bg-[#044244]'></Box>
    </Box>
    <Footer />

    <div ref={floatButton} className="absolute right-0" style={{bottom:bottom+'px'}} onPointerDown={onPointerDown}>
      <Button onClick={() => setScanOpen(true)} className="w-64px h-64px" variant="contained">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#FFF" fillRule="nonzero" d="M29.333 20c.737 0 1.334.597 1.334 1.333v5.334a4 4 0 0 1-4 4h-5.334a1.333 1.333 0 0 1 0-2.667h5.334c.736 0 1.333-.597 1.333-1.333v-5.334c0-.736.597-1.333 1.333-1.333M2.667 20C3.403 20 4 20.597 4 21.333v5.334C4 27.403 4.597 28 5.333 28h5.334a1.333 1.333 0 0 1 0 2.667H5.333a4 4 0 0 1-4-4v-5.334c0-.736.597-1.333 1.334-1.333Zm28-5.333v2.666H1.333v-2.666h29.334m-4-13.334a4 4 0 0 1 4 4v5.334a1.333 1.333 0 0 1-2.667 0V5.333C28 4.597 27.403 4 26.667 4h-5.334a1.333 1.333 0 0 1 0-2.667h5.334Zm-16 0a1.333 1.333 0 0 1 0 2.667H5.333C4.597 4 4 4.597 4 5.333v5.334a1.333 1.333 0 0 1-2.667 0V5.333a4 4 0 0 1 4-4h5.334"/></svg>
      </Button>
    </div>

    <ScanFlow open={scanOpen} onClose={() => setScanOpen(false)} />
  </Box>
}

export default OperatePage

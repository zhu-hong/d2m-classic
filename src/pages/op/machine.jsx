import { useConfigStore } from "@/store.jsx"
import { Box, Button, Divider, Grid, Paper, Skeleton, ToggleButtonGroup } from "@mui/material"
import { useState } from "react"
import { AdjustDialog } from "@/components/adjustDialog.jsx"
import { CheckDialog } from "@/components/checkDialog.jsx"
import { ColorButton } from "@/components/ccolorButton.jsx"
import { useEffect } from "react"
import { useApi } from "@/hook.js"

const MachinePage = () => {
  const { config, workcenters, workstations } = useConfigStore()

  const [single, setSingle] = useState(true)
  const [equipmentInfo, setEquipmentInfo] = useState(null)
  const [curEquipment, setCurEquipment] = useState({
    Parameters: [],
    Mros: [],
  })

  const [debugOpen, setDebugOpen] = useState(false)
  const [checkOpen, setCheckOpen] = useState(false)

  const api = useApi(config.serveUrl)

  useEffect(() => {
    api().GetEquipment({
      MachineGuid: config.MachineGuid,
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
    }).then((res) => {
      if(res.code === 0) {
        setEquipmentInfo(res.data)
      }
    })
  }, [])

  const onClickEquipment = (equipment) => {
    api().GetEquipmentInformation({
      EquipmentGuid: equipment.EquipmentGuid,
    }).then((res) => {
      if(res.code === 0) {
        setCurEquipment({
          ...equipment,
          ...res.data,
        })
        setSingle(true)
      }
    })
  }

  const updateEquipment = () => {
    api().GetEquipment({
      MachineGuid: config.MachineGuid,
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
    }).then((res) => {
      if(res.code === 0) {
        setEquipmentInfo(res.data)
      }
    })
    api().GetEquipmentInformation({
      EquipmentGuid: curEquipment.EquipmentGuid,
    }).then((res) => {
      if(res.code === 0) {
        setCurEquipment({
          ...curEquipment,
          ...res.data,
        })
        setSingle(true)
      }
    })
  }

  return <Box className='w-full h-full flex flex-col'>
    {
      single
      ?
      <>
        <Box className='flex justify-between items-center mb-16px'>
          {
            [
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M12 .5a4 4 0 0 1 3.995 3.8l.001.03a10.002 10.002 0 0 1 5.896 10.646l-.01-.006a4 4 0 1 1-4.237 6.764l.015.01-.096.066A9.953 9.953 0 0 1 12 23.5c-2.1 0-4.05-.648-5.66-1.755l.097-.073a4 4 0 1 1-4.302-6.711l-.027.014A10.002 10.002 0 0 1 8.003 4.33l-.002.084L8 4.5a4 4 0 0 1 4-4M8.417 6.28l.026.052a8 8 0 0 0-4.38 8.17L4.03 14.5H4a4 4 0 0 1 3.628 5.686l-.005.011A7.961 7.961 0 0 0 12 21.5c1.616 0 3.12-.479 4.377-1.303l-.005-.01a4 4 0 0 1 3.429-5.681l.199-.006-.062.002a8 8 0 0 0-4.382-8.17l-.011.023a4 4 0 0 1-7.128-.075M20 16.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-16 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8-14a2 2 0 1 0 0 4 2 2 0 0 0 0-4" /></svg>,
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M14 1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4v1.014h6V9a1 1 0 0 1 2 0v1.014h1V7a1 1 0 0 1 2 0v3.014h.131a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5.05a2 2 0 0 1-2-2v-5.57H7.906v5.57a2 2 0 0 1-2 2H3.131a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2H8V9H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm7.131 11.015h-18v9h2.775v-7.57h10.175v7.57h5.05v-9M14 3H4v4h10z"/></svg>,
            ][config.terminalType]
          }
          <p className="text-2xl text-[#000C25] font-medium mx-16px">{config.terminalInfo[['WorkcenterName','WorkstationName'][config.terminalType]]}</p>
          {
            [workcenters.length>1,workstations.length>1][config.terminalType]
            ?
            <Button variant="outlined" size="small" className="h-32px" onClick={(e) => {
              e.stopPropagation()
              navigate('/choose-work')
            }}>切换</Button>
            :
            null
          }
          <Box className='flex-auto'></Box>
          <Button variant="outlined" onClick={() => setSingle(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-20px"><path fill="#058373" fillRule="evenodd" d="M4 1.333A2.657 2.657 0 0 0 1.333 4v24A2.657 2.657 0 0 0 4 30.667h12A2.657 2.657 0 0 0 18.667 28v-8H16v8H4V4h12v8h2.667V4A2.657 2.657 0 0 0 16 1.333Zm20 9.334v4H9.333v2.666H24v4L30.667 16 24 10.667" /></svg>
            退出
          </Button>
        </Box>
        <Box className='flex-auto overflow-auto flex'>
          <Box className='h-full w-304px bg-white overflow-auto p-24px'>
            <img src={curEquipment.EquipmentPicture} className="w-full h-200px object-cover block mb-24px" />
            <p className="text-xl text-[#000C25] mb-8px">{curEquipment.EquipmentName}</p>
            <p className="text-[#646A73] text-lg font-bold">{curEquipment.EquipmentCode}</p>
            <Box className='mt-38px flex items-center justify-between text-lg'>
              <p className="text-[#646A73]">设备类别</p>
              <p className="text-[#000c25]">{curEquipment.EquipmentTypeName}</p>
            </Box>
            <Box className='mt-16px flex items-center justify-between text-lg'>
              <p className="text-[#646A73]">设备型号</p>
              <p className="text-[#000c25]">{curEquipment.EquipmentSpec}</p>
            </Box>
            <Box className='mt-16px flex items-center justify-between text-lg'>
              <p className="text-[#646A73]">设备状态</p>
              {
                curEquipment.DebugState === '待调机'
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
            </Box>
            <Box className='mt-16px flex items-center justify-between text-lg'>
              <p className="text-[#646A73]">点检状态</p>
              {
                curEquipment.CheckState === '待点检'
                ?
                <Button variant="contained" size="small" color="warning" style={{backgroundColor:'#FFEBCC',borderRadius:'0'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill="#F90" fillRule="evenodd" d="M10.12.833c5.04.065 9.074 4.19 9.047 9.222-.037 5.042-4.125 9.112-9.167 9.112A9.182 9.182 0 0 1 .833 10v-.183A9.164 9.164 0 0 1 10.12.833m.713 11.25H9.167v1.667h1.666zm0-5.833H9.167v4.167h1.666z"/></svg>
                  <p className="text-[#FF9900] ml-4px">待点检</p>
                </Button>
                :
                <Button variant="contained" size="small" color="warning" style={{backgroundColor:'#CDE6E3',borderRadius:'0'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill="#058373" fillRule="evenodd" d="M10.12.833c5.04.065 9.074 4.19 9.047 9.222-.037 5.042-4.125 9.112-9.167 9.112A9.182 9.182 0 0 1 .833 10v-.183A9.164 9.164 0 0 1 10.12.833m3.705 5.484-5.492 5.491-2.158-2.15L5 10.833l3.333 3.334L15 7.5z"/></svg>
                  <p className="text-[#058373] ml-4px">已点检</p>
                </Button>
              }
            </Box>
            <Box className='mt-16px flex items-center justify-between'>
              <p className="text-[#646A73]">最近一次点检</p>
              <p className="text-[#000c25]">{curEquipment.LastCheckTime}</p>
            </Box>
          </Box>
          <Box className='h-full flex-auto bg-white mx-16px overflow-auto px-22px py-24px'>
            <div className="flex justify-between items-center">
              <p className="text-xl text-[#000c25]">运行参数</p>
              <p className="text-[#646A73]">更新时间：{curEquipment.UpdateTime}</p>
            </div>
            <Box className='border border-[#CECECE] mt-17px'>
              <Box className='w-full overflow-auto bg-[#CDE6E3] children:py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
                <Box sx={{width:'15%'}}>参数编号</Box>
                <Box sx={{width:'15%'}}>参数名称</Box>
                <Box sx={{width:'20%'}}>标准</Box>
                <Box sx={{width:'25%'}}>当前值</Box>
                <Box sx={{width:'25%'}}>单位</Box>
              </Box>
              {
                curEquipment.Parameters.map((p, i) => {
                  return <Box className={['w-full children:py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px', ['bg-[#FFFFFF]','bg-[#F2F9F8]'][i%2]].join(' ')}>
                    <Box sx={{width:'15%'}}>{p.ParameterCode}</Box>
                    <Box sx={{width:'15%'}}>{p.ParamterName}</Box>
                    <Box sx={{width:'20%'}}>{p.StandardValue}</Box>
                    <Box sx={{width:'25%'}}>{p.Value}</Box>
                    <Box sx={{width:'25%'}}>{p.UnitName}</Box>
                  </Box>
                })
              }
            </Box>
          </Box>
          <Box className='h-full w-408px  bg-white overflow-auto px-22px py-24px'>
            <div className="flex justify-between items-center">
              <p className="text-xl text-[#000c25]">MRO信息</p>
            </div>
            <Box className='border border-[#CECECE] mt-17px'>
              <Box className='w-full overflow-auto bg-[#CDE6E3] children:py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px'>
                <Box sx={{width:'40%'}}>MRO 类型</Box>
                <Box sx={{width:'30%'}}>MRO 编号</Box>
                <Box sx={{width:'30%'}}>MRO 名称</Box>
              </Box>
              {
                curEquipment.Mros.map((m) => {
                  return <Box className={['w-full children:py-10px flex children:border-b not-last:children:border-r children:border-[#CECECE] children:pl-10px', ['bg-[#FFFFFF]','bg-[#F2F9F8]'][i%2]].join(' ')}>
                    <Box sx={{width:'40%'}}>{m.MroType}</Box>
                    <Box sx={{width:'30%'}}>{m.MroCode}</Box>
                    <Box sx={{width:'30%'}}>{m.MroName}</Box>
                  </Box>
                })
              }
            </Box>
          </Box>
        </Box>
        <Box className='bg-white text-right py-13px mt-16px'>
          <>
            <ColorButton onClick={() => setCheckOpen(true)} ccolor='#006A9F' style={{width:'187px',height:'72px',borderRadius:'0'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#FFF" fillRule="nonzero" d="M28 1.333A2.667 2.667 0 0 1 30.667 4v24A2.667 2.667 0 0 1 28 30.667H4A2.667 2.667 0 0 1 1.333 28V4A2.667 2.667 0 0 1 4 1.333zM28 4H4v24h24zM11.333 16a4.667 4.667 0 1 1 0 9.333 4.667 4.667 0 0 1 0-9.333m14 4v2.667h-8V20zm-14-1.333a2 2 0 1 0 0 4 2 2 0 0 0 0-4M15.976 7.15a1.2 1.2 0 0 1 .107 1.575l-.107.123-3.995 3.994c-.69.677-1.771.709-2.499.104l-.14-.13-2.199-2.24a1.2 1.2 0 0 1 1.592-1.79l.122.11 1.82 1.854 3.601-3.6a1.2 1.2 0 0 1 1.698 0m9.357 2.182V12h-8V9.333z"/></svg>
              <span className="ml-8px">前往点检</span>
            </ColorButton>
            {
              checkOpen
              ?
              <CheckDialog equipment={curEquipment} open={checkOpen} onClose={() => setCheckOpen(false)} onConfirm={updateEquipment} />
              :
              null
            }
          </>
          <>
            <ColorButton onClick={() => setDebugOpen(true)} ccolor='#058373' style={{width:'187px',height:'72px',borderRadius:'0'}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#FFF" fillRule="nonzero" d="M22 20a3.333 3.333 0 0 1 3.333 3.333V24h4.334a1 1 0 0 1 1 1v.667a1 1 0 0 1-1 1l-4.334-.001v.667a3.333 3.333 0 1 1-6.666 0v-.667H2.332a1 1 0 0 1-1-1V25a1 1 0 0 1 1-1h16.333v-.667A3.333 3.333 0 0 1 22 20m0 2.667a.667.667 0 0 0-.667.666v4a.667.667 0 0 0 1.334 0v-4a.667.667 0 0 0-.667-.666m-10.667-12A3.333 3.333 0 0 1 14.667 14v.667h15a1 1 0 0 1 1 1v.666a1 1 0 0 1-1 1h-15V18A3.333 3.333 0 0 1 8 18v-.667H2.332a1 1 0 0 1-1-1v-.666a1 1 0 0 1 1-1H8L8 14a3.333 3.333 0 0 1 3.333-3.333m0 2.666a.667.667 0 0 0-.666.667v4A.667.667 0 1 0 12 18v-4a.667.667 0 0 0-.667-.667M22 1.333a3.333 3.333 0 0 1 3.333 3.334v.666h4.334a1 1 0 0 1 1 1V7a1 1 0 0 1-1 1h-4.334v.667a3.333 3.333 0 1 1-6.666 0v-.668L2.332 8a1 1 0 0 1-1-1v-.667a1 1 0 0 1 1-1h16.333v-.666A3.333 3.333 0 0 1 22 1.333M22 4a.667.667 0 0 0-.667.667v4a.667.667 0 0 0 1.334 0v-4A.667.667 0 0 0 22 4"/></svg>
              <span className="ml-8px">前往调机</span>
            </ColorButton>
            {
              debugOpen
              ?
              <AdjustDialog equipment={curEquipment} open={debugOpen} onClose={() => setDebugOpen(false)}  onConfirm={updateEquipment}/>
              :
              null
            }
          </>
        </Box>
      </>
      :
      <>
        <Box className='h-128px bg-white px-16px flex justify-between items-center'>
          <Box>
            <Box className='flex items-center'>
              {
                [
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M12 .5a4 4 0 0 1 3.995 3.8l.001.03a10.002 10.002 0 0 1 5.896 10.646l-.01-.006a4 4 0 1 1-4.237 6.764l.015.01-.096.066A9.953 9.953 0 0 1 12 23.5c-2.1 0-4.05-.648-5.66-1.755l.097-.073a4 4 0 1 1-4.302-6.711l-.027.014A10.002 10.002 0 0 1 8.003 4.33l-.002.084L8 4.5a4 4 0 0 1 4-4M8.417 6.28l.026.052a8 8 0 0 0-4.38 8.17L4.03 14.5H4a4 4 0 0 1 3.628 5.686l-.005.011A7.961 7.961 0 0 0 12 21.5c1.616 0 3.12-.479 4.377-1.303l-.005-.01a4 4 0 0 1 3.429-5.681l.199-.006-.062.002a8 8 0 0 0-4.382-8.17l-.011.023a4 4 0 0 1-7.128-.075M20 16.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-16 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8-14a2 2 0 1 0 0 4 2 2 0 0 0 0-4" /></svg>,
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M14 1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4v1.014h6V9a1 1 0 0 1 2 0v1.014h1V7a1 1 0 0 1 2 0v3.014h.131a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5.05a2 2 0 0 1-2-2v-5.57H7.906v5.57a2 2 0 0 1-2 2H3.131a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2H8V9H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm7.131 11.015h-18v9h2.775v-7.57h10.175v7.57h5.05v-9M14 3H4v4h10z"/></svg>,
                ][config.terminalType]
              }
                <p className="text-2xl text-[#000C25] font-medium mx-16px">{config.terminalInfo['WorkcenterName','WorkstationName'][config.terminalType]}</p>
              {
                [workcenters.length>1,workstations.length>1][config.terminalType]
                ?
                <Button variant="outlined" size="small" className="h-32px" onClick={(e) => {
                  e.stopPropagation()
                  navigate('/choose-work')
                }}>切换</Button>
                :
                null
              }
              <Button variant="outlined">切换</Button>
            </Box>
            {
              equipmentInfo === null
              ?
              null
              :
              <p className="mt-13px text-2xl text-[#646A73]">设备总数：<span className="text-[#000C25]">{equipmentInfo.EquipmentAmount}台</span></p>
            }
          </Box>
          {
            equipmentInfo === null
            ?
            <div className="flex-auto ml-10">
              <Skeleton variant="rectangular" height={96} width='100%' />
            </div>
            :
            <>
              <Box className='flex-auto'></Box>
              <Box className='mr-48px'>
                <Box className='text-xl text-[#646A73] mb-8px'>已调机设备数</Box>
                <Box className='text-40px text-[#058373] font-bold'>{equipmentInfo.DebugedAmount}</Box>
              </Box>
              <Box className='mr-48px'>
                <Box className='text-xl text-[#646A73] mb-8px'>待调机设备数</Box>
                <Box className='text-40px text-[#FF9900] font-bold'>{equipmentInfo.UndebugAmount}</Box>
              </Box>
              <Box className='mr-48px'>
                <Box className='text-xl text-[#646A73] mb-8px'>已点检设备数</Box>
                <Box className='text-40px text-[#058373] font-bold'>{equipmentInfo.CheckedAmount}</Box>
              </Box>
              <Box className='mr-48px'>
                <Box className='text-xl text-[#646A73] mb-8px'>待点检设备数</Box>
                <Box className='text-40px text-[#FF9900] font-bold'>{equipmentInfo.UnCheckAmount}</Box>
              </Box>
            </>
          }
        </Box>
        <Box className='mt-16px'>
          <ToggleButtonGroup color="primary" size="large" sx={{border:'1px solid #CECECE'}}>
            <Button value={1} variant='contained' className="w-120px"><span className="text-lg font-medium">列表模式</span></Button>
          </ToggleButtonGroup>
        </Box>

        <Grid sx={{marginTop:'0px'}} container spacing={2}>
          {
            (equipmentInfo === null || !equipmentInfo.Equipments)
            ?
            <>
              <Grid item xs={3}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={3}><Skeleton variant="rectangular" height={250} /></Grid>
            </>
            :
            equipmentInfo.Equipments.map((e) => {
              return <Grid item xs={3} key={e.EquipmentGuid} onClick={() => onClickEquipment(e)}>
                <Paper className="px-24px py-21px">
                  <Box className='flex justify-between items-center mb-9px'>
                    <Box>
                      <Box className='text-xl text-[#000C25] mb-8px'>{e.EquipmentName}</Box>
                      <Box className='text-[#646A73]'>{e.EquipmentCode}</Box>
                    </Box>
                    <img src={e.EquipmentPicture} className="w-104px h-71px object-cover" />
                  </Box>
                  <Divider />
                  <Box className='flex justify-between items-center mb-11px mt-15px'>
                    <p className="text-[#646A73]">设备类别</p>
                    <p className="text-[#000C25]">{e.EquipmentTypeName}</p>
                  </Box>
                  <Box className='flex justify-between items-center mb-11px'>
                    <p className="text-[#646A73]">设备型号</p>
                    <p className="text-[#000C25]">{e.EquipmentSpec}</p>
                  </Box>
                  <Box className='flex justify-between items-center mb-11px'>
                    <p className="text-[#646A73]">所在工位</p>
                    <p className="text-[#000C25]">{e.WorkstationName}</p>
                  </Box>
                  <Box className='flex justify-between items-center mb-11px'>
                    <p className="text-[#646A73]">设备状态</p>
                    {
                      e.DebugState === '待调机'
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
                  </Box>
                  <Box className='flex justify-between items-center mb-11px'>
                    <p className="text-[#646A73]">点检状态</p>
                    {
                      e.CheckState === '待点检'
                      ?
                      <Button variant="contained" size="small" color="warning" style={{backgroundColor:'#FFEBCC',borderRadius:'0'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill="#F90" fillRule="evenodd" d="M10.12.833c5.04.065 9.074 4.19 9.047 9.222-.037 5.042-4.125 9.112-9.167 9.112A9.182 9.182 0 0 1 .833 10v-.183A9.164 9.164 0 0 1 10.12.833m.713 11.25H9.167v1.667h1.666zm0-5.833H9.167v4.167h1.666z"/></svg>
                        <p className="text-[#FF9900] ml-4px">待点检</p>
                      </Button>
                      :
                      <Button variant="contained" size="small" color="warning" style={{backgroundColor:'#CDE6E3',borderRadius:'0'}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path fill="#058373" fillRule="evenodd" d="M10.12.833c5.04.065 9.074 4.19 9.047 9.222-.037 5.042-4.125 9.112-9.167 9.112A9.182 9.182 0 0 1 .833 10v-.183A9.164 9.164 0 0 1 10.12.833m3.705 5.484-5.492 5.491-2.158-2.15L5 10.833l3.333 3.334L15 7.5z"/></svg>
                        <p className="text-[#058373] ml-4px">已点检</p>
                      </Button>
                    }
                  </Box>
                </Paper>
              </Grid>
            })
          }
        </Grid>
      </>
    }
  </Box>
}

export default MachinePage

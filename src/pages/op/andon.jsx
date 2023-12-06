import { ColorButton } from "@/components/ccolorButton.jsx"
import { StationsDialog } from "@/components/stationsDialog.jsx"
import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { AccessTime } from "@mui/icons-material"
import { RadioButtonUnchecked } from "@mui/icons-material"
import { Box, Button, ButtonBase, Skeleton } from "@mui/material"
import { useState, useEffect } from "react"

const AndonPage = () => {
  const [andonItems, setAndonItems] = useState(null)
  const [curAndonTriggor, setCurAndonTriggor] = useState(null)
  const [employee, setEmployee] = useState(null)
  const [stationOpen, setStationOpen] = useState(false)
  const [andons, setAndons] = useState(null)

  const { config } = useConfigStore()

  const api = useApi(config.serveUrl)

  useEffect(() => {
    getAndonItems()
    getAndon()
  }, [])

  const getAndonItems = () => {
    api().GetAndonType().then(async (res) => {
      if(res.code === 0) {
        let reqs = res.data.map(async (a) => {
          const res = await api().GetAndonItem({
            WorkshopGuid: config.WorkshopGuid,
            AndonTypeGuid: a.AndonTypeGuid,
          })
          return res.data
        })
        reqs = await Promise.all(reqs)
        console.log(reqs)
      }
    })
  }

  const getAndon = () => {
    api().GetAndon({
      WorkcenterGuid: config.terminalInfo.WorkcenterGuid,
    }).then((res) => {
      if(res.code === 0) {
        setAndons(res.data)
      }
    })
  }

  const applyTriggor = (andon) => {
    setCurAndonTriggor(andon)
    api().AndonTriggerValidate({
      MachineGuid: config.MachineGuid,
      Code: '',
    }).then((res) => {
      if(res.code === 0) {
        setEmployee(res.data)
        if(res.data.Workstations.length === 1) {
          onStationConfirm(res.data.Workstations[0].WorkstationGuid)
        } else {
          setStationOpen(true)
        }
      }
    })
  }

  const onStationConfirm = (stationGuid) => {
    setStationOpen(false)
    api().AndonTrigger({
      AndonItemGuid: curAndonTriggor.andonItemGuid,
      EmployeeGuid: employee.employeeGuid,
      EmployeeName: employee.employeeName,
      WorkstationGuid: stationGuid,
    }).then((res) => {
      if(res.code === 0) {
        getAndon()
      }
    })
  }

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

      {
        andons === null
        ?
        <>
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </>
        :
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
          {
            andons.length>0
            ?
            andons.map((s, i) => {
              return <Box className={['w-full h-56px leading-56px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px', ['bg-[#FFFFFF]','bg-[#F2F9F8]'][i%2]].join(' ')}>
                <Box sx={{width:'10%'}}>安灯类型</Box>
                <Box sx={{width:'15%'}}>安灯定义</Box>
                <Box sx={{width:'15%'}}>触发工位</Box>
                <Box sx={{width:'10%'}}>触发人员</Box>
                <Box sx={{width:'20%'}}>触发时间</Box>
                <Box sx={{width:'10%'}}>持续时间</Box>
                <Box sx={{width:'10%'}}>
                  <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#fcdada',color:'#f04848'}}>待处理</ButtonBase>
                  <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#F5E7C7',color:'#FF9900'}}>待关闭</ButtonBase>
                  <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#CDE6E3',color:'#058373'}}>已完结</ButtonBase>
                  <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#D1DDFA',color:'#4D69FF'}}>待确认</ButtonBase>
                </Box>
                <Box sx={{width:'10%'}}>
                  <Button variant="contained" className="w-80px h-32px"><span className="text-lg">处理</span></Button>
                  <Button variant="outlined" className="w-80px h-32px"><span className="text-lg">关闭</span></Button>
                  -
                  <Button variant="outlined" className="w-80px h-32px"><span className="text-lg">确认</span></Button>
                </Box>
              </Box>
            })
            :
            <div className="w-full h-40 border-r border-l border-b flex justify-center items-center">
              <span className="mr-2">暂无数据</span>
              <AccessTime />
            </div>
          }
        </div>
      }
    </div>
    <div className="w-full h-98px bg-white mt-16px flex items-center overflow-auto px-16px">
      {
        andonItems === null
        ?
        <div className="w-full h-full">
          <Skeleton height='100%' />
        </div>
        :
        andonItems.map((a, i) => {
          return <ColorButton onClick={() => applyTriggor(a)} key={a.andonItemGuid} ccolor='#058373' sx={{height:'72px',marginRight:(i===andonItems.length-1)?'auto':undefined}}>
            {a.andonItem}
          </ColorButton>
        })
      }

      {
        stationOpen
        ?
        <StationsDialog stations={employee.workstations} open={stationOpen} onClose={() => setStationOpen(false)} onConfirm={onStationConfirm} />
        :
        null
      }
    </div>
  </div>
}

export default AndonPage

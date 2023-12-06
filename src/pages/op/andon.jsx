import { ColorButton } from "@/components/ccolorButton.jsx"
import { JobNumDialog } from "@/components/jobNumDialog.jsx"
import { StationsDialog } from "@/components/stationsDialog.jsx"
import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { AccessTime } from "@mui/icons-material"
import { Close } from "@mui/icons-material"
import { RadioButtonUnchecked } from "@mui/icons-material"
import { Box, Button, ButtonBase, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Skeleton } from "@mui/material"
import { useState, useEffect } from "react"

const AndonPage = () => {
  const [andonItems, setAndonItems] = useState(null)
  const [curAndonTriggor, setCurAndonTriggor] = useState(null)
  const [employee, setEmployee] = useState(null)
  const [stationOpen, setStationOpen] = useState(false)
  const [andons, setAndons] = useState(null)
  const [jobNumOpen, setJobNumOpen] = useState(false)
  const [curAndonRecord, setCurAndonRecord] = useState(null)

  const [IsStop, setIsStop] = useState(0)
  const [isStopOpen, setIsStopOpen] = useState(false)

  const [faultOpen, setFaultOpen] = useState(false)
  const [faultOptions, setFaultOptions] = useState([])
  const [curFaultOption, setCurFaultOption] = useState(null)
  
  const [openPass, setOpenPass] = useState(false)
  const [isPass, setIsPass] = useState(1)

  /**
   * 0 创建
   * 1 处理
   * 2 关闭
   * 3 确认
   */
  const [opType, setOpType] = useState(0)

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
        setAndonItems((await Promise.all(reqs)).flat())
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
    setOpType(0)
    setCurAndonTriggor(andon)
    setJobNumOpen(true)
  }

  const onJobNumConfirm = (jobNum) => {
    setJobNumOpen(false)
    if(opType === 0) {
      api().AndonTriggerValidate({
        MachineGuid: config.MachineGuid,
        Code: jobNum,
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
    } else if(opType === 1) {
      api().AndonResponseValidate({
        AndonGuid: curAndonRecord.AndonGuid,
        Code: jobNum,
      }).then((res) => {
        if(res.code === 0) {
          api().AndonResponse({
            AndonGuid: curAndonRecord.AndonGuid,
            EmployeeGuid: res.data.EmployeeGuid,
            EmployeeName: res.data.EmployeeName,
            IsStop: 0,
          }).then(() => getAndon())
        } else if(res.code === 2) {
          setEmployee(res.data)
          setIsStop(1)
          setIsStopOpen(true)
        }
      })
    } else if(opType === 2) {
      api().AndonSolveValidate({
        AndonGuid: curAndonRecord.AndonGuid,
        Code: jobNum,
      }).then((res) => {
        if(res.code === 0) {
          api().GetAndonFault({
            AndonItemGuid: curAndonRecord.AndonItemGuid,
          }).then((res) => {
            if(res.code === 0) {
              setEmployee(res.data)
              setFaultOptions(res.data)
              setCurFaultOption(null)
              setFaultOpen(true)
            }
          })
        }
      })
    } else if(opType === 3) {
      api().AndonCloseValidate({
        AndonGuid: curAndonRecord.AndonGuid,
        Code: jobNum,
      }).then((res) => {
        if(res.code === 0) {
          setEmployee(res.data)
          setIsPass(1)
          setOpenPass(true)
        }
      })
    }
  }

  const onStationConfirm = (stationGuid) => {
    if(opType === 0) {
      setStationOpen(false)
      api().AndonTrigger({
        AndonItemGuid: curAndonTriggor.AndonItemGuid,
        EmployeeGuid: employee.EmployeeGuid,
        EmployeeName: employee.EmployeeName,
        WorkstationGuid: stationGuid,
      }).then((res) => {
        if(res.code === 0) {
          getAndon()
        }
      })
    }
  }

  const onOperationAndon = (andon) => {
    setCurAndonRecord(andon)
    if(andon.State === '待处理') {
      setOpType(1)
    } else if(andon.State === '待关闭') {
      setOpType(2)
    } else if(andon.State === '待确认') {
      setOpType(3)
    }
    setJobNumOpen(true)
  }

  const onCinfirmIsStop = (isstop) => {
    setIsStopOpen(false)
    api().AndonResponse({
      AndonGuid: curAndonRecord.AndonGuid,
      EmployeeGuid: res.data.EmployeeGuid,
      EmployeeName: res.data.EmployeeName,
      IsStop: isstop,
    }).then(() => getAndon())
  }

  const onConfirmFaultOption = (faultOption) => {
    setFaultOpen(false)
    api().AndonSolve({
      AndonFaultGuid: faultOption.AndonFaultGuid,
      AndonFaultName: faultOption.AndonFaultName,
      AndonFaultTypeGuid: faultOption.AndonFaultTypeGuid,
      AndonFaultTypeName: faultOption.AndonFaultTypeName,
      AndonGuid: curAndonRecord.AndonGuid,
      EmployeeGuid: employee.EmployeeGuid,
      EmployeeName: employee.EmployeeName,
    }).then(() => getAndon())
  }

  const onCinfirmIsPass = (ispass) => {
    setOpenPass(false)
    api().AndonClose({
      AndonGuid: curAndonRecord.AndonGuid,
      EmployeeGuid: employee.EmployeeGuid,
      EmployeeName: employee.EmployeeName,
      IsPass: ispass,
    }).then(() => getAndon())
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
          <Box className='w-full overflow-auto bg-[#CDE6E3] children:py-10px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px'>
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
              return <Box key={s.AndonGuid} className={['w-full children:py-10px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px', ['bg-[#FFFFFF]','bg-[#F2F9F8]'][i%2]].join(' ')}>
                <Box sx={{width:'10%'}}>{s.AndonTypeName}</Box>
                <Box sx={{width:'15%'}}>{s.AndonItem}</Box>
                <Box sx={{width:'15%'}}>{s.WorkstationName}</Box>
                <Box sx={{width:'10%'}}>{s.TriggerUser}</Box>
                <Box sx={{width:'20%'}}>{s.TriggerTime}</Box>
                <Box sx={{width:'10%'}}>{s.Duration}</Box>
                <Box sx={{width:'10%'}}>
                  {
                    s.State === '待处理'
                    ?
                    <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#fcdada',color:'#f04848'}}>待处理</ButtonBase>
                    :
                    s.State === '待关闭'
                    ?
                    <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#F5E7C7',color:'#FF9900'}}>待关闭</ButtonBase>
                    :
                    s.State === '已完结'
                    ?
                    <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#CDE6E3',color:'#058373'}}>已完结</ButtonBase>
                    :
                    <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#D1DDFA',color:'#4D69FF'}}>待确认</ButtonBase>
                  }
                </Box>
                <Box sx={{width:'10%'}}>
                  {
                    s.State === '待处理'
                    ?
                    <>
                      <Button onClick={() => onOperationAndon(s)} variant="contained" className="w-80px h-32px"><span className="text-lg">处理</span></Button>

                      <Dialog open={isStopOpen} maxWidth='720px' onClose={() => setIsStopOpen(false)} scroll='paper'>
                        <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
                          <p>停线选择</p>
                          <IconButton onClick={() => setIsStopOpen(false)}><Close/></IconButton>
                        </DialogTitle>
                        <DialogContent className='w-720px flex justify-center items-center mt-4'>
                          <div onClick={() => setIsStop(1)} className={["w-160px h-160px flex justify-center items-center mr-10 text-2xl text-[#000C25] font-medium border", IsStop === 1?'border-[#058373] bg-[#F2F9F8]':'border-[#CECECE]'].join(' ')}>停线</div>
                          <div onClick={() => setIsStop(0)} className={["w-160px h-160px flex justify-center items-center text-2xl text-[#000C25] font-medium border", IsStop === 0?'border-[#058373] bg-[#F2F9F8]':'border-[#CECECE]'].join(' ')}>不停线</div>
                        </DialogContent>
                        <DialogActions style={{justifyContent:'center'}}>
                          <Button onClick={() => onCinfirmIsStop(IsStop)} className="w-144px h-56px" variant="contained"><span className="text-2xl text-white">确认</span></Button>
                          <Button onClick={() => setIsStopOpen(false)} className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}}><span className="text-2xl text-[#646A73]">取消</span></Button>
                        </DialogActions>
                      </Dialog>
                    </>
                    :
                    s.State === '待关闭'
                    ?
                    <>
                      <Button onClick={() => onOperationAndon(s)} variant="outlined" className="w-80px h-32px"><span className="text-lg">关闭</span></Button>

                      <Dialog open={faultOpen} maxWidth='950px' onClose={() => setFaultOpen(false)} scroll='paper'>
                        <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
                          <p>Andon定义</p>
                          <IconButton onClick={() => setFaultOpen(false)}><Close/></IconButton>
                        </DialogTitle>
                        <DialogContent className='w-950px flex justify-center items-center mt-4'>
                          <Grid container spacing={4}>
                            {
                              faultOptions.map((f) => <Grid xs={3} item key={f.AndonFaultGuid}>
                                <div onClick={() => setCurFaultOption(f)} className={["w-full h-120px border flex justify-center items-center text-[#000C25] font-medium text-2xl", (curFaultOption&&curFaultOption.AndonFaultGuid === f.AndonFaultGuid)?'border-[#058373] bg-[#F2F9F8]':'border-[#CECECE]'].join(' ')}>{f.AndonFaultName}</div>
                              </Grid>)
                            }
                          </Grid>
                        </DialogContent>
                        <DialogActions style={{justifyContent:'center'}}>
                          <Button disabled={curFaultOption === null} onClick={() => onConfirmFaultOption(curFaultOption)} className="w-144px h-56px" variant="contained"><span className="text-2xl text-white">确认</span></Button>
                          <Button onClick={() => setFaultOpen(false)} className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}}><span className="text-2xl text-[#646A73]">取消</span></Button>
                        </DialogActions>
                      </Dialog>
                    </>
                    :
                    s.State === '已完结'
                    ?
                    <>-</>
                    :
                    <>
                      <Button onClick={() => onOperationAndon(s)} variant="outlined" className="w-80px h-32px"><span className="text-lg">确认</span></Button>

                      <Dialog open={openPass} maxWidth='720px' onClose={() => setOpenPass(false)} scroll='paper'>
                        <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
                          <p>判定</p>
                          <IconButton onClick={() => setOpenPass(false)}><Close/></IconButton>
                        </DialogTitle>
                        <DialogContent className='w-720px flex justify-center items-center mt-4'>
                          <div onClick={() => setIsPass(1)} className={["w-160px h-160px flex justify-center items-center mr-10 text-2xl text-[#000C25] font-medium border", isPass === 1?'border-[#058373] bg-[#F2F9F8]':'border-[#CECECE]'].join(' ')}>通过</div>
                          <div onClick={() => setIsPass(0)} className={["w-160px h-160px flex justify-center items-center text-2xl text-[#000C25] font-medium border", isPass === 0?'border-[#058373] bg-[#F2F9F8]':'border-[#CECECE]'].join(' ')}>不通过</div>
                        </DialogContent>
                        <DialogActions style={{justifyContent:'center'}}>
                          <Button onClick={() => onCinfirmIsPass(isPass)} className="w-144px h-56px" variant="contained"><span className="text-2xl text-white">确认</span></Button>
                          <Button onClick={() => setOpenPass(false)} className="w-144px h-56px" style={{backgroundColor:'#CECECE',borderRadius:'0',marginLeft:32}}><span className="text-2xl text-[#646A73]">取消</span></Button>
                        </DialogActions>
                      </Dialog>
                    </>
                  }
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
          return <ColorButton onClick={() => applyTriggor(a)} key={a.AndonItemGuid} ccolor='#058373' sx={{height:'72px',marginLeft:(i===andonItems.length-1)?'auto':undefined}}>
            {a.AndonItem}
          </ColorButton>
        })
      }

      <JobNumDialog open={jobNumOpen} onClose={() => setJobNumOpen(false)} onConfirm={onJobNumConfirm} />

      {
        stationOpen
        ?
        <StationsDialog stations={employee.Workstations} open={stationOpen} onClose={() => setStationOpen(false)} onConfirm={onStationConfirm} />
        :
        null
      }
    </div>
  </div>
}

export default AndonPage

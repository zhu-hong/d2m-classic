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
            onStationConfirm(res.data.Workstations[0].WorkstationGuid, res.data)
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
          setEmployee(res.data)
          api().GetAndonFault({
            AndonItemGuid: curAndonRecord.AndonItemGuid,
          }).then((res) => {
            if(res.code === 0) {
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

  const onStationConfirm = (stationGuid, realtimeemployee) => {
    realtimeemployee = realtimeemployee || employee
    setStationOpen(false)
    api().AndonTrigger({
      AndonItemGuid: curAndonTriggor.AndonItemGuid,
      EmployeeGuid: realtimeemployee.EmployeeGuid,
      EmployeeName: realtimeemployee.EmployeeName,
      WorkstationGuid: stationGuid,
    }).then((res) => {
      if(res.code === 0) {
        getAndon()
      }
    })
  }

  const onOperationAndon = (andon) => {
    setCurAndonRecord(andon)
    if(andon.State === '待处理') {
      setOpType(1)
    } else if(andon.State === '处理中') {
      setOpType(2)
    } else if(andon.State === '关闭中') {
      setOpType(3)
    }
    setJobNumOpen(true)
  }

  const onCinfirmIsStop = (isstop) => {
    setIsStopOpen(false)
    api().AndonResponse({
      AndonGuid: curAndonRecord.AndonGuid,
      EmployeeGuid: employee.EmployeeGuid,
      EmployeeName: employee.EmployeeName,
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
    <div className="flex-auto bg-white py-26px px-16px overflow-auto flex flex-col">
      <div className="flex justify-center items-center mb-24px flex-none">
        <Button className="h-48px" variant="outlined" size="large">
          <RadioButtonUnchecked />
          <span className="text-xl ml-8px">Andon触发</span>
        </Button>
        <div className="w-50px bg-[#CDE6E3] h-4px flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#CDE6E3" d="M11.05 12L7.175 6.575q-.35-.5-.087-1.037T7.975 5q.25 0 .475.113t.35.312L13.5 12l-4.7 6.575q-.125.2-.35.313T7.975 19q-.6 0-.875-.537t.075-1.038L11.05 12ZM17 12l-3.875-5.425q-.35-.5-.088-1.037T13.926 5q.25 0 .475.113t.35.312L19.45 12l-4.7 6.575q-.125.2-.35.313t-.475.112q-.6 0-.875-.537t.075-1.038L17 12Z"></path></svg>
        </div>
        <Button className="h-48px" variant="outlined" size="large">
          <RadioButtonUnchecked />
          <span className="text-xl ml-8px">Andon处理</span>
        </Button>
        <div className="w-50px bg-[#CDE6E3] h-4px flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#CDE6E3" d="M11.05 12L7.175 6.575q-.35-.5-.087-1.037T7.975 5q.25 0 .475.113t.35.312L13.5 12l-4.7 6.575q-.125.2-.35.313T7.975 19q-.6 0-.875-.537t.075-1.038L11.05 12ZM17 12l-3.875-5.425q-.35-.5-.088-1.037T13.926 5q.25 0 .475.113t.35.312L19.45 12l-4.7 6.575q-.125.2-.35.313t-.475.112q-.6 0-.875-.537t.075-1.038L17 12Z"></path></svg>
        </div>
        <Button className="h-48px" variant="outlined" size="large">
          <RadioButtonUnchecked />
          <span className="text-xl ml-8px">Andon关闭</span>
        </Button>
        <div className="w-50px bg-[#CDE6E3] h-4px flex justify-center items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#CDE6E3" d="M11.05 12L7.175 6.575q-.35-.5-.087-1.037T7.975 5q.25 0 .475.113t.35.312L13.5 12l-4.7 6.575q-.125.2-.35.313T7.975 19q-.6 0-.875-.537t.075-1.038L11.05 12ZM17 12l-3.875-5.425q-.35-.5-.088-1.037T13.926 5q.25 0 .475.113t.35.312L19.45 12l-4.7 6.575q-.125.2-.35.313t-.475.112q-.6 0-.875-.537t.075-1.038L17 12Z"></path></svg>
        </div>
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
        <div className="border border-[#CECECE] overflow-auto flex-auto flex flex-col">
          <Box className='w-full flex-none bg-[#CDE6E3] children:py-10px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px'>
            <Box sx={{width:'10%'}}>安灯类型</Box>
            <Box sx={{width:'15%'}}>安灯定义</Box>
            <Box sx={{width:'15%'}}>触发工位</Box>
            <Box sx={{width:'10%'}}>触发人员</Box>
            <Box sx={{width:'20%'}}>触发时间</Box>
            <Box sx={{width:'10%'}}>持续时间</Box>
            <Box sx={{width:'10%'}}>状态</Box>
            <Box sx={{width:'10%'}} className='border-r-0'>操作</Box>
          </Box>
          {
            andons.length>0
            ?
            <div className="flex-auto overflow-auto">
              {
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
                        s.State === '处理中'
                        ?
                        <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#F5E7C7',color:'#FF9900'}}>待关闭</ButtonBase>
                        :
                        s.State === '关闭中'
                        ?
                        <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#D1DDFA',color:'#4D69FF'}}>待确认</ButtonBase>
                        :
                        <ButtonBase className="w-80px h-32px text-lg" sx={{backgroundColor:'#CDE6E3',color:'#058373'}}>已完结</ButtonBase>
                      }
                    </Box>
                    <Box sx={{width:'10%'}} className='border-r-0'>
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
                        s.State === '处理中'
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
                        s.State === '关闭中'
                        ?
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
                        :
                        <>-</>
                      }
                    </Box>
                  </Box>
                })
              }
            </div>
            :
            <div className="w-full flex-auto border-[#CECECE] flex flex-col justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="195" height="146"><defs><path id="a" d="M0 0h182.019v24.27H0z"/></defs><g fill="none" fillRule="evenodd"><g transform="translate(6.067 101.93)"><mask id="b" fill="#fff"><use xlink:href="#a"/></mask><path fill="#EEF1F5" d="M91.01 0c50.263 0 91.009 5.433 91.009 12.135 0 6.701-40.746 12.134-91.01 12.134C40.746 24.27 0 18.836 0 12.135 0 5.433 40.746 0 91.01 0" mask="url(#b)"/></g><path fill="#FFD500" d="M35.035 103.827s-6.846-1.77-8.339-7.803c0 0 10.614-2.03 10.921 8.333l-2.582-.53"/><path fill="#FFD500" d="M34.725 103.132s-4.068-6.894-.488-13.336c0 0 6.86 4.667 3.813 13.348l-3.325-.012"/><path fill="#FFD500" d="M36.404 104.338s2.38-8.147 9.578-9.688c0 0 1.35 5.315-4.658 9.707l-4.92-.02"/><path fill="#8F959E" d="m31.55 103.144 1.327 9.667 8.36.04 1.234-9.661z"/><path fill="#DFE3E9" d="m77.66 16.988.001 4.068a2 2 0 0 0 2 2h.854a2 2 0 0 0 2-2v-4.068h12.134v4.068A2 2 0 0 0 96.5 23.05l.15.006h.854a2 2 0 0 0 2-2l-.001-4.068h12.135v4.068a2 2 0 0 0 1.85 1.994l.15.006h.854a2 2 0 0 0 2-2v-4.068h12.988a4 4 0 0 1 4 4v89.077a4 4 0 0 1-4 4H64.673a4 4 0 0 1-4-4V20.988a4 4 0 0 1 4-4H77.66m41.686 48.539H74.808a2 2 0 0 0-2 2v.854a2 2 0 0 0 2 2h44.538a2 2 0 0 0 2-2v-.854a2 2 0 0 0-2-2m0-14.562H74.808a2 2 0 0 0-2 2v.854a2 2 0 0 0 2 2h44.538a2 2 0 0 0 2-2v-.854a2 2 0 0 0-2-2m0-14.561H74.808a2 2 0 0 0-2 2v.854a2 2 0 0 0 2 2h44.538a2 2 0 0 0 2-2v-.854a2 2 0 0 0-2-2"/><path fill="#8F959E" d="M60.673 87.369h72.807v22.696a4 4 0 0 1-4 4H64.673a4 4 0 0 1-4-4V87.37"/><g fillRule="nonzero"><path fill="#000" fillOpacity=".1" d="M41.258 63.1c0 10.052 8.149 18.202 18.201 18.202 10.053 0 18.202-8.15 18.202-18.202 0-10.053-8.149-18.202-18.202-18.202-10.052 0-18.201 8.15-18.201 18.202"/><path fill="#FFD500" d="M43.685 60.673c0 10.053 8.149 18.202 18.201 18.202 10.053 0 18.202-8.15 18.202-18.202 0-10.053-8.149-18.202-18.202-18.202-10.052 0-18.201 8.15-18.201 18.202"/><path fill="#FFF" d="M69.906 52.646a1.581 1.581 0 0 1 0 2.258l-5.86 5.779 5.86 5.78a1.58 1.58 0 0 1 .083 2.124l-.103.113a1.634 1.634 0 0 1-2.269.02l-5.86-5.78-5.583 5.506a1.633 1.633 0 0 1-1.573.435 1.607 1.607 0 0 1-1.156-1.14 1.582 1.582 0 0 1 .441-1.552l5.583-5.506-5.583-5.507a1.583 1.583 0 0 1-.474-1.399l.033-.153c.148-.558.59-.994 1.156-1.14a1.633 1.633 0 0 1 1.573.436l5.583 5.505 5.86-5.778a1.635 1.635 0 0 1 2.29-.001"/></g><g fillRule="nonzero"><path fill="#000" fillOpacity=".1" d="m100.717 107.684 6.503-18.459 36.221-36.228a4 4 0 0 1 5.497-.152l.16.152 9.463 9.462a4 4 0 0 1 .152 5.497l-.152.16-36.226 36.222-21.618 3.346"/><path fill="#FFD500" d="m113.287 88.809 36.221-36.229a4 4 0 0 1 5.657 0l9.464 9.463a4 4 0 0 1 0 5.656l-36.227 36.223-15.115-15.113"/><path fill="#FFF" d="m113.287 88.809-6.503 18.458 21.618-3.345z"/></g></g></svg>
              <span className="text-[#8F959E]">暂无记录</span>
            </div>
          }
        </div>
      }
    </div>
    {
      (andonItems === null || andonItems.length !== 0)
      ?
      <div className="w-full flex-none h-98px bg-white mt-16px flex items-center overflow-auto px-16px">
        {
          andonItems === null
          ?
          <div className="w-full h-full">
            <Skeleton height='100%' />
          </div>
          :
          andonItems.map((a, i) => {
            return <ColorButton onClick={() => applyTriggor(a)} key={a.AndonItemGuid} ccolor='#058373' sx={{height:'72px',marginLeft:(i===0)?'auto':undefined}}>
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
      :
      null
    }
  </div>
}

export default AndonPage

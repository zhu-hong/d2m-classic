import { Footer } from '@/components/footer.jsx'
import { Header } from '@/components/header.jsx'
import { useApi } from '@/hook.js'
import { useConfigStore } from '@/store.jsx'
import { ArrowBackIosNew } from '@mui/icons-material'
import { Box, Button, Grid, IconButton, Paper, Skeleton } from '@mui/material'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const ChooseToWorkPage = () => {
  const { config, setConfig, setWorkcenters, setWorkstations } = useConfigStore()
  const [list, setList] = useState([])

  const [loading, setLoading] = useState(true)

  const api = useApi(config.serveUrl)
  const navigate = useNavigate()

  const [searchParams] = useSearchParams()

  useEffect(() => {
    api().GetMachineDetail({
      MachineGuid: config.MachineGuid,
    }).then((res) => {
      setWorkcenters(res.Workcenters)
      setWorkstations(res.Workstations)
      if(config.terminalType === 0) {
        setList(res.Workcenters)
      } else {
        setList(res.Workstations)
      }
      setLoading(false)
    })
  }, [])

  const onSelect = (item) => {
    setConfig({
      terminalInfo: item,
    })
    const to = searchParams.get('to')
    if(to === null) {
      navigate(['/op','/op/process'][config.terminalType])
    } else {
      navigate(decodeURIComponent(to))
    }
  }

  return <Box component='main' className='h-full flex flex-col'>
    <Header actions={[
      <Button key='action-quit' className="w-64px h-64px">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path fill="#FFF" fillRule="evenodd" d="M4 1.333A2.657 2.657 0 0 0 1.333 4v24A2.657 2.657 0 0 0 4 30.667h12A2.657 2.657 0 0 0 18.667 28v-8H16v8H4V4h12v8h2.667V4A2.657 2.657 0 0 0 16 1.333Zm20 9.334v4H9.333v2.666H24v4L30.667 16 24 10.667" /></svg>
      </Button>
    ]} />
    <Box className="flex-auto bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center text-white pl-80px pr-64px overflow-hidden" style={{ backgroundImage: 'url(./banner.png)' }}>
      <Box component='div' className='w-full h-full overflow-auto bg-[#DAE6E5] relative px-32px pb-24px'>
        <header className='sticky w-full top-0 left-0 py-24px flex items-center justify-center bg-[#DAE6E5] z-10'>
          <Button variant='text' color='secondary' sx={{ position: 'absolute', left: '0' }} onClick={() => history.back()}>
            <ArrowBackIosNew />
            <span className='text-xl'>返回</span>
          </Button>
          <span className='text-3xl text-[#000c25] font-medium text-center'>选择{['工作中心','工位'][config.terminalType]}</span>
        </header>
        {
          loading
          ?
          <Grid container spacing={4}>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={368} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={368} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={368} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={368} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={368} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="rectangular" height={368} />
            </Grid>
          </Grid>
          :
          <Grid container spacing={4}>
            {
              list.map((l, index) => <Grid key={index} item xs={4}>
                <Paper sx={{ padding: '18px 32px 34px', display: 'flex', flexDirection: 'column' }}>
                  <Box>
                    <IconButton>
                      {
                        [
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M12 .5a4 4 0 0 1 3.995 3.8l.001.03a10.002 10.002 0 0 1 5.896 10.646l-.01-.006a4 4 0 1 1-4.237 6.764l.015.01-.096.066A9.953 9.953 0 0 1 12 23.5c-2.1 0-4.05-.648-5.66-1.755l.097-.073a4 4 0 1 1-4.302-6.711l-.027.014A10.002 10.002 0 0 1 8.003 4.33l-.002.084L8 4.5a4 4 0 0 1 4-4M8.417 6.28l.026.052a8 8 0 0 0-4.38 8.17L4.03 14.5H4a4 4 0 0 1 3.628 5.686l-.005.011A7.961 7.961 0 0 0 12 21.5c1.616 0 3.12-.479 4.377-1.303l-.005-.01a4 4 0 0 1 3.429-5.681l.199-.006-.062.002a8 8 0 0 0-4.382-8.17l-.011.023a4 4 0 0 1-7.128-.075M20 16.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-16 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8-14a2 2 0 1 0 0 4 2 2 0 0 0 0-4" /></svg>,
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path fill="#058373" fillRule="nonzero" d="M14 1a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-4v1.014h6V9a1 1 0 0 1 2 0v1.014h1V7a1 1 0 0 1 2 0v3.014h.131a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5.05a2 2 0 0 1-2-2v-5.57H7.906v5.57a2 2 0 0 1-2 2H3.131a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2H8V9H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm7.131 11.015h-18v9h2.775v-7.57h10.175v7.57h5.05v-9M14 3H4v4h10z"/></svg>,
                        ][config.terminalType]
                      }
                    </IconButton>
                    <Box sx={{ margin: '16px 0 6px' }} className='text-[#000C25] text-2xl font-medium truncate'>{l[['WorkcenterName','WorkstationName'][config.terminalType]]}</Box>
                    <Box sx={{ marginBottom: '24px' }} className='truncate'>
                      <span className='text-[#646A73]'>所属{['车间','工作中心'][config.terminalType]}：</span>
                      {[config.WorkshopName,l.WorkcenterName][config.terminalType]}
                    </Box>
                    <Box sx={{ display: 'flex', color: '#000c25' }} className='text-xl'><span className='flex-1 text-[#646A73]'>任务数量</span><span className='flex-1 text-[#646A73]'>在岗人数</span></Box>
                    <Box sx={{ display: 'flex', marginBottom: '24px' }} className='text-40px leading-47px'>
                      <span className='flex-1'>90</span>
                      <span className='flex-1'>100</span>
                    </Box>
                    <Button onClick={() => onSelect(l)} variant='contained' sx={{width:'100%',height:'48px'}}><span className='text-lg'>进入{['工作中心','工位'][config.terminalType]}</span></Button>
                  </Box>
                </Paper>
              </Grid>)
            }
          </Grid>
        }
      </Box>
    </Box>
    <Footer />
  </Box>
}

export default ChooseToWorkPage

import { Box, Button, CircularProgress, MenuItem, OutlinedInput, Select, Skeleton } from "@mui/material"
import { useState } from "react"
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import zhCN from 'date-fns/locale/zh-CN'
import dayjs from "dayjs"
import { useConfigStore } from "@/store.jsx"
import { useApi } from "@/hook.js"
import { useEffect } from "react"
import { enqueueSnackbar } from "notistack"
import { delay } from "@/utils.js"
registerLocale('zh-CN', zhCN)

const LogPage = () => {
  const [list, setList] = useState(null)
  const [startTime, setStartTime] = useState(new Date(dayjs().add(-6, 'day').format('YYYY/MM/DD 00:00:00')))
  const [endTime, setEndTime] = useState(new Date(dayjs().format('YYYY/MM/DD 23:59:00')))
  const [opType, setOpType] = useState('all')
  const { config } = useConfigStore()
  const [man, setMan] = useState('')
  const [loading, setLoading] = useState(true)

  const api = useApi(config.serveUrl)

  const onSearch = () => {
    if(dayjs(startTime).add(7, 'day') < dayjs(endTime)) {
      enqueueSnackbar('最多可查询连续7天的日志，请合理选择时间段', { variant: 'warning' })
      return
    }
    setLoading(true)
    api().GetTerminalOperateLog({
      TerminalType: 1,
      StartTime: dayjs(startTime).format('YYYY-MM-DD 00:00:00'),
      EndTime: dayjs(endTime).format('YYYY-MM-DD 23:59:59'),
      Name: opType === 'all' ? '' : opType,
      Code: man,
    }).then((res) => {
      if(res.code === 0) {
        setList(res.data)
      }
    }).finally(async () => {
      await delay(1000)
      setLoading(false)
    })
  }

  useEffect(() => {
    onSearch()
  }, [])

  return <Box className='flex flex-col h-full overflow-auto'>
    <Box className='bg-white px-24px py-28px mb-16px flex items-center flex-wrap text-lg text-[#646A73] children:mr-40px children:mb-16px'>
      <Box className='flex items-center'>
        <Box className="flex-none">时间筛选：</Box>
        <ReactDatePicker filterDate={(date) => date <= endTime} locale="zh-CN" dateFormat="yy/MM/dd" placeholderText='开始时间' selected={startTime} onChange={setStartTime} />
        <Box className='mx-8px'>~</Box>
        <ReactDatePicker filterDate={(date) => date >= startTime} locale="zh-CN" dateFormat="yy/MM/dd" placeholderText='结束时间' selected={endTime} onChange={setEndTime} />
      </Box>
      <Box className='flex items-center'>
        <Box className="flex-none">操作类型：</Box>
        <Select value={opType} size='small' className='w-184px' onChange={(e) => setOpType(e.target.value)}>
          <MenuItem value='all'>全部</MenuItem>
          <MenuItem value='任务变更'>任务变更</MenuItem>
          <MenuItem value='生产变更'>生产变更</MenuItem>
          <MenuItem value='报工反馈'>报工反馈</MenuItem>
          <MenuItem value='签到/签退'>签到/签退</MenuItem>
          <MenuItem value='设备调机'>设备调机</MenuItem>
          <MenuItem value='MRO装卸'>MRO装卸</MenuItem>
          <MenuItem value='设备点检'>设备点检</MenuItem>
          <MenuItem value='安灯'>安灯</MenuItem>
        </Select>
      </Box>
      <Box className='flex items-center'>
        <Box className="flex-none">操作人：</Box>
        <OutlinedInput size='small' className='w-184px' placeholder="请输入工号或姓名" value={man} />
      </Box>
      <Box><Button variant="contained" onClick={onSearch} disabled={loading}>
        {
          loading
          ?
          <CircularProgress size={20} color='inherit' className='mr-2' />
          :
          null
        }
        <span className="text-lg">查询</span>
      </Button></Box>
    </Box>
    <Box className='flex-auto bg-white p-16px overflow-auto'>
      <Box className='text-[#000C25] border border-[#CECECE] h-full flex flex-col'>
        <Box className='w-full flex-none bg-[#CDE6E3] children:py-10px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px'>
          <Box sx={{width:'15%'}}>操作时间</Box>
          <Box sx={{width:'15%'}}>操作人</Box>
          <Box sx={{width:'15%'}}>操作类型</Box>
          <Box sx={{width:'15%'}}>操作位置</Box>
          <Box sx={{width:'40%'}} className='border-r-0'>操作详情</Box>
        </Box>
        <Box className='flex-auto overflow-auto'>
          {
            list === null
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
            </>
            :
            list.length === 0
            ?
            <div className="w-full h-full flex justify-center items-center flex-col">
              <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="195" height="146"><defs><path id="a" d="M0 0h182.019v24.27H0z"/></defs><g fill="none" fillRule="evenodd"><g transform="translate(6.067 101.93)"><mask id="b" fill="#fff"><use xlinkHref="#a"/></mask><path fill="#EEF1F5" d="M91.01 0c50.263 0 91.009 5.433 91.009 12.135 0 6.701-40.746 12.134-91.01 12.134C40.746 24.27 0 18.836 0 12.135 0 5.433 40.746 0 91.01 0" mask="url(#b)"/></g><path fill="#FFD500" d="M35.035 103.827s-6.846-1.77-8.339-7.803c0 0 10.614-2.03 10.921 8.333l-2.582-.53"/><path fill="#FFD500" d="M34.725 103.132s-4.068-6.894-.488-13.336c0 0 6.86 4.667 3.813 13.348l-3.325-.012"/><path fill="#FFD500" d="M36.404 104.338s2.38-8.147 9.578-9.688c0 0 1.35 5.315-4.658 9.707l-4.92-.02"/><path fill="#8F959E" d="m31.55 103.144 1.327 9.667 8.36.04 1.234-9.661z"/><path fill="#DFE3E9" d="m77.66 16.988.001 4.068a2 2 0 0 0 2 2h.854a2 2 0 0 0 2-2v-4.068h12.134v4.068A2 2 0 0 0 96.5 23.05l.15.006h.854a2 2 0 0 0 2-2l-.001-4.068h12.135v4.068a2 2 0 0 0 1.85 1.994l.15.006h.854a2 2 0 0 0 2-2v-4.068h12.988a4 4 0 0 1 4 4v89.077a4 4 0 0 1-4 4H64.673a4 4 0 0 1-4-4V20.988a4 4 0 0 1 4-4H77.66m41.686 48.539H74.808a2 2 0 0 0-2 2v.854a2 2 0 0 0 2 2h44.538a2 2 0 0 0 2-2v-.854a2 2 0 0 0-2-2m0-14.562H74.808a2 2 0 0 0-2 2v.854a2 2 0 0 0 2 2h44.538a2 2 0 0 0 2-2v-.854a2 2 0 0 0-2-2m0-14.561H74.808a2 2 0 0 0-2 2v.854a2 2 0 0 0 2 2h44.538a2 2 0 0 0 2-2v-.854a2 2 0 0 0-2-2"/><path fill="#8F959E" d="M60.673 87.369h72.807v22.696a4 4 0 0 1-4 4H64.673a4 4 0 0 1-4-4V87.37"/><g fillRule="nonzero"><path fill="#000" fillOpacity=".1" d="M41.258 63.1c0 10.052 8.149 18.202 18.201 18.202 10.053 0 18.202-8.15 18.202-18.202 0-10.053-8.149-18.202-18.202-18.202-10.052 0-18.201 8.15-18.201 18.202"/><path fill="#FFD500" d="M43.685 60.673c0 10.053 8.149 18.202 18.201 18.202 10.053 0 18.202-8.15 18.202-18.202 0-10.053-8.149-18.202-18.202-18.202-10.052 0-18.201 8.15-18.201 18.202"/><path fill="#FFF" d="M69.906 52.646a1.581 1.581 0 0 1 0 2.258l-5.86 5.779 5.86 5.78a1.58 1.58 0 0 1 .083 2.124l-.103.113a1.634 1.634 0 0 1-2.269.02l-5.86-5.78-5.583 5.506a1.633 1.633 0 0 1-1.573.435 1.607 1.607 0 0 1-1.156-1.14 1.582 1.582 0 0 1 .441-1.552l5.583-5.506-5.583-5.507a1.583 1.583 0 0 1-.474-1.399l.033-.153c.148-.558.59-.994 1.156-1.14a1.633 1.633 0 0 1 1.573.436l5.583 5.505 5.86-5.778a1.635 1.635 0 0 1 2.29-.001"/></g><g fillRule="nonzero"><path fill="#000" fillOpacity=".1" d="m100.717 107.684 6.503-18.459 36.221-36.228a4 4 0 0 1 5.497-.152l.16.152 9.463 9.462a4 4 0 0 1 .152 5.497l-.152.16-36.226 36.222-21.618 3.346"/><path fill="#FFD500" d="m113.287 88.809 36.221-36.229a4 4 0 0 1 5.657 0l9.464 9.463a4 4 0 0 1 0 5.656l-36.227 36.223-15.115-15.113"/><path fill="#FFF" d="m113.287 88.809-6.503 18.458 21.618-3.345z"/></g></g></svg>
              <span className="text-[#8F959E]">暂无数据</span>
            </div>
            :
            list.map((l, i) => {
              return <Box key={i} className={['w-full children:p-24px flex children:border-b children:border-r children:border-[#CECECE] children:pl-10px', ['bg-[#FFFFFF]','bg-[#F2F9F8]'][i%2]].join(' ')}>
                <Box sx={{width:'15%'}}>{dayjs(l.Date).format('YY/MM/DD HH:mm')}</Box>
                <Box sx={{width:'15%'}}>{l.EmployeeName}</Box>
                <Box sx={{width:'15%'}}>{l.Name}</Box>
                <Box sx={{width:'15%'}}>{l.Location}</Box>
                <Box sx={{width:'40%'}} className='border-r-0'>{l.Content}</Box>
              </Box>
            })
          }
        </Box>
      </Box>
    </Box>
  </Box>
}

export default LogPage

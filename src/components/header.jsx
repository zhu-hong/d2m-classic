import { Button } from '@mui/material'
import { useState } from 'react'
import { useEffect } from 'react'
import dayjs from 'dayjs'

export const Header = ({ actions = [] }) => {
  const [time, setTime] = useState(dayjs().format('hh:mm\tYYYY/MM/DD'))
  useEffect(() => {
    const t = setInterval(() => {
      setTime(dayjs().format('hh:mm  YYYY/MM/DD'))
    }, 1000)
    return () => clearInterval(t)
  }, [])

  return <header className="h-64px bg-[#044244] flex items-center justify-between text-white">
    <Button className='w-64px h-64px pl-24px'>
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><g fill="none" fillRule="evenodd"><rect width="40" height="40" rx="4"/><path fill="#FFF" fillRule="nonzero" d="M16.969 5c.416 0 .773.117 1.197.117l1.262 3.05V8.05h18.419v.117c0 3.423-2.817 6.181-6.24 6.181H16.37c-1.503 0-2.94.598-3.962 1.679-1.08 1.021-1.737 2.459-1.679 3.962 0 1.503.599 2.94 1.679 3.963 1.022 1.145 2.46 1.86 3.962 1.802l10.414.007 1.38 3.481c-.417.365-.774.84-1.198 1.263-.481.416-.897.773-1.379 1.197l-3.48-1.38c-.84.482-1.68.84-2.577 1.08l-1.379 3.481c-.416.117-.774.117-1.197.117h-1.197c-.416 0-.839-.117-1.196-.117l-1.38-3.48a10.675 10.675 0 0 1-2.576-1.08l-3.48 1.379a12.667 12.667 0 0 1-1.38-1.197 8.241 8.241 0 0 1-1.197-1.263l1.38-3.48c-.482-.84-.84-1.68-1.08-2.577l-3.481-1.379c-.117-.606-.117-1.204-.117-1.802 0-.606.058-1.204.117-1.803l3.495-1.386c.241-.898.599-1.737 1.08-2.576l-1.379-3.481c.416-.365.774-.84 1.197-1.263.481-.416.897-.773 1.38-1.197l3.48 1.38c.84-.482 1.678-.84 2.576-1.08l1.38-3.481C14.99 5 15.348 5 15.771 5Zm-.778 11.996.172.001h18.419v.058c0 3.423-2.817 6.181-6.24 6.181H16.488c-1.744 0-3.182-1.444-3.182-3.181v-.175c.059-1.686 1.438-2.941 3.058-2.883Z"/></g></svg>
    </Button>
    <h1 className="text-2xl font-medium">添翼工业软件有限公司</h1>
    <div className="flex-auto"></div>
    <p className="text-2xl font-bold mr-16px whitespace-pre-wrap">{time}</p>
    {
      actions.map((a) => a)
    }
  </header>
}

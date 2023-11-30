import { Footer } from '@/components/footer.jsx'
import { Header } from '@/components/header.jsx'
import { Box } from '@mui/material'

export const Setup = () => {
  return <Box component='main' className='h-full flex flex-col'>
    <Header />
    <Box className="flex-auto"></Box>
    <Footer />
  </Box>
}

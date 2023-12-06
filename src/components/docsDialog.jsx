import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { ArrowForwardIos } from "@mui/icons-material"
import { Close } from "@mui/icons-material"
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Skeleton } from "@mui/material"
import { enqueueSnackbar } from "notistack"
import { useEffect, useState } from "react"

export const Docs = ({ open, onClose, task }) => {
  const [previewIng, setPreviewIng] = useState(false)

  const [docs, setDocs] = useState(null)
  const [curDoc, setCurDoc] = useState(null)
  const [loadingDoc, setLoadingDoc] = useState(false)

  const { config } = useConfigStore()

  const api = useApi(config.serveUrl)

  useEffect(() => {
    if(task === null) return

    api().GetDocument({
      prodstdaGuid: task.prodstdaGuid,
      productGuid: task.productCode,
      productVersion: task.productVersion,
    }).then((res) => {
      setDocs(res.data)
    }).catch(() => enqueueSnackbar('文档获取失败', { variant: 'error' } ))
  }, [task])

  const openDoc = (doc) => {
    setLoadingDoc(true)
    api().GetDocumentContent({
      fileKey: doc.fileKey,
    }).then((res) => {
      setCurDoc(res)
      setPreviewIng(true)
    }).catch(() => enqueueSnackbar('文档获取失败', { variant: 'error' } )).finally(() => setLoadingDoc(false))
  }

  return <Dialog open={open} maxWidth='840px' onClose={onClose} scroll='paper'>
    <DialogTitle className="flex justify-between items-center bg-[#DAE6E5] h-56px">
      <p>{previewIng?'文档预览':'文档'}</p>
      <IconButton onClick={onClose}><Close /></IconButton>
    </DialogTitle>
    {
      previewIng
      ?
      <DialogContent className='w-840px text-right'>
        <Box className='mt-24px h-564px border border-[#CECECE] flex flex-col'>
          <Box className='flex justify-between items-center px-22px py-12px border-b border-[#CECECE]'>
            <span>文档名称. jpg</span>
            <Button variant="outlined" className="w-32px h-32px"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><g fill="#058373" fillRule="evenodd"><path d="M11 18.111H3.889V11H2.12l-.009 8.889H11zM19.889 2.111H11V3.89h7.111V11h1.769z"/></g></svg></Button>
          </Box>
        </Box>
        <Button color="info" variant="contained" className="w-136px h-56px" size="large" sx={{marginTop:'24px'}} onClick={() => setPreviewIng(false)}><span className="text-2xl">退出</span></Button>
      </DialogContent>
      :
      <DialogContent className='w-840px' sx={{marginTop:'16px'}}>
        {/* <Box className='px-24px h-90px border w-full border-[#CECECE] bg-[#F6F6F6] flex items-center justify-between'>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><g fill="none" fillRule="nonzero"><path fill="#2F97FE" d="M5 0h16l8 8v22a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/><path fill="#97C6FF" d="m21 0 8 8h-6a2 2 0 0 1-2-2z"/><path fill="#FFF" d="M7.565 13.031h2.77l2.264 8.4 2.243-8.4h2.309l2.243 8.4 2.265-8.4h2.769L20.602 24.4h-2.333l-2.264-8.31-2.287 8.31h-2.33z"/></g></svg>
          <Box className='ml-10px'>当前文档名称.doc</Box>
          <Box className='flex-auto'></Box>
          <Box className='text-lg text-[#646A73]'>文档类型：<span className="text-[#000C25]">作业指导书</span></Box>
          <Box className='flex-auto'></Box>
          <Button variant="contained" color="warning"><span className="text-white">当前</span></Button>
        </Box> */}
        <Grid container spacing={2}>
          {
            docs === null
            ?
            <>
              <Grid item xs={4}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={4}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={4}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={4}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={4}><Skeleton variant="rectangular" height={250} /></Grid>
              <Grid item xs={4}><Skeleton variant="rectangular" height={250} /></Grid>
            </>
            :
            <>
              {
                docs.map((d) => {
                  return <Grid key={d.documentCode} item xs={4}>
                    <Box className='border border-[#CECECE] p-24px mt-16px'>
                      <svg className="mb-19px w-56px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" fillRule="nonzero"><path fill="#2F97FE" d="M5 0h16l8 8v22a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/><path fill="#97C6FF" d="m21 0 8 8h-6a2 2 0 0 1-2-2z"/><path fill="#FFF" d="M7.565 13.031h2.77l2.264 8.4 2.243-8.4h2.309l2.243 8.4 2.265-8.4h2.769L20.602 24.4h-2.333l-2.264-8.31-2.287 8.31h-2.33z"/></g></svg>
                      <Box className='text-[#000C25] text-lg mn-4px'>{d.documentName}</Box>
                      <Box className='mb-36px text-[#646A73]'>{d.documentTypeName}</Box>
                      <Button disabled={loadingDoc} onClick={() => openDoc(d)}><span className="text-lg mr-4px">前往查看</span><ArrowForwardIos fontSize="small" /></Button>
                    </Box>
                  </Grid>
                })
              }
              {/* <Grid item xs={4}>
                <Box className='border border-[#CECECE] p-24px mt-16px'>
                  <svg className="mb-19px w-56px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" fillRule="nonzero"><path fill="#2F97FE" d="M5 0h16l8 8v22a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/><path fill="#97C6FF" d="m21 0 8 8h-6a2 2 0 0 1-2-2z"/><path fill="#FFF" d="M7.565 13.031h2.77l2.264 8.4 2.243-8.4h2.309l2.243 8.4 2.265-8.4h2.769L20.602 24.4h-2.333l-2.264-8.31-2.287 8.31h-2.33z"/></g></svg>
                  <Box className='text-[#000C25] text-lg mn-4px'>文档名称.doc</Box>
                  <Box className='mb-36px text-[#646A73]'>作业指导书</Box>
                  <Button onClick={() => setPreviewIng(true)}><span className="text-lg mr-4px">前往查看</span><ArrowForwardIos fontSize="small" /></Button>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box className='border border-[#CECECE] p-24px mt-16px'>
                  <svg className="mb-19px" xmlns="http://www.w3.org/2000/svg" width="56" height="56"><g fill="none" fillRule="evenodd"><g fillRule="nonzero"><path fill="#00B632" d="M8.75 0h28l14 14v38.5a3.5 3.5 0 0 1-3.5 3.5H8.75a3.5 3.5 0 0 1-3.5-3.5v-49A3.5 3.5 0 0 1 8.75 0"/><path fill="#7FDA98" d="m36.75 0 14 14h-10.5a3.5 3.5 0 0 1-3.5-3.5z"/></g><path fill="#FFF" d="m21.875 20.125 6.124 8.575 6.126-8.575h5.25l-8.751 12.25 8.751 12.25h-5.25L28 36.049l-6.125 8.576h-5.25l8.75-12.25-8.75-12.25z"/></g></svg>
                  <Box className='text-[#000C25] text-lg mn-4px'>文档名称.doc</Box>
                  <Box className='mb-36px text-[#646A73]'>作业指导书</Box>
                  <Button><span className="text-lg mr-4px">前往查看</span><ArrowForwardIos fontSize="small" /></Button>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box className='border border-[#CECECE] p-24px mt-16px'>
                  <svg className="mb-19px" xmlns="http://www.w3.org/2000/svg" width="56" height="56"><g fill="none"><path fill="#FFB02C" d="M8.75 0h28l14 14v38.5a3.5 3.5 0 0 1-3.5 3.5H8.75a3.5 3.5 0 0 1-3.5-3.5v-49A3.5 3.5 0 0 1 8.75 0"/><path fill="#FFF" d="M39.972 19.633H16.08c-1.27 0-2.24.97-2.24 2.24v20.832c0 1.194.97 2.24 2.24 2.24h23.893c1.195 0 2.24-1.046 2.24-2.24V21.873c0-1.195-.97-2.24-2.24-2.24M21.156 23.44c1.27 0 2.39 1.045 2.39 2.389a2.359 2.359 0 0 1-2.39 2.39c-1.269 0-2.389-1.046-2.389-2.39s1.12-2.39 2.39-2.39M19.44 41.585c-.224 0-.448-.075-.672-.224-.448-.374-.448-.896-.075-1.344l4.63-6.496c.373-.374.896-.448 1.344-.15l4.032 2.838 7.242-7.766c.374-.373 2.166-2.314 3.211-.149V41.51c0 .075-19.712.075-19.712.075"/><path fill="#FFCF80" d="m36.75 0 14 14h-10.5a3.5 3.5 0 0 1-3.5-3.5z"/></g></svg>
                  <Box className='text-[#000C25] text-lg mn-4px'>文档名称.doc</Box>
                  <Box className='mb-36px text-[#646A73]'>作业指导书</Box>
                  <Button><span className="text-lg mr-4px">前往查看</span><ArrowForwardIos fontSize="small" /></Button>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box className='border border-[#CECECE] p-24px mt-16px'>
                  <svg className="mb-19px" xmlns="http://www.w3.org/2000/svg" width="56" height="56"><g fill="none" fillRule="evenodd"><g fillRule="nonzero"><path fill="#7165E3" d="M8.75 0h28l14 14v38.5a3.5 3.5 0 0 1-3.5 3.5H8.75a3.5 3.5 0 0 1-3.5-3.5v-49A3.5 3.5 0 0 1 8.75 0"/><path fill="#ABA2FF" d="m36.75 0 14 14h-10.5a3.5 3.5 0 0 1-3.5-3.5z"/></g><path fill="#FFF" d="M32.375 24.5c.966 0 1.75.784 1.75 1.75v2.032c-.352.507-.672 1.02-.959 1.537-.527.951-.791 1.797-.791 2.537 0 .741.246 1.556.737 2.445.307.555.644 1.1 1.012 1.637l.001 2.062a1.75 1.75 0 0 1-1.75 1.75h-15.75a1.75 1.75 0 0 1-1.75-1.75V26.25c0-.966.784-1.75 1.75-1.75zm7.72.875c.43 0 .71.123.838.37s.192.552.192.914v11.333c0 .362-.092.683-.276.963-.183.28-.46.42-.827.42-.128 0-.291-.05-.491-.148-.2-.099-.4-.214-.6-.346-.2-.132-.387-.263-.563-.395a3.44 3.44 0 0 1-.383-.32 16.212 16.212 0 0 1-.947-.94 19 19 0 0 1-1.283-1.505 13.636 13.636 0 0 1-1.139-1.729c-.327-.592-.491-1.136-.491-1.63 0-.493.176-1.057.527-1.69.352-.634.776-1.256 1.27-1.865a18.264 18.264 0 0 1 1.56-1.691c.543-.519.998-.91 1.366-1.173.143-.099.34-.218.587-.358.248-.14.467-.21.66-.21"/></g></svg>
                  <Box className='text-[#000C25] text-lg mn-4px'>文档名称.doc</Box>
                  <Box className='mb-36px text-[#646A73]'>作业指导书</Box>
                  <Button><span className="text-lg mr-4px">前往查看</span><ArrowForwardIos fontSize="small" /></Button>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box className='border border-[#CECECE] p-24px mt-16px'>
                  <svg className="mb-19px" xmlns="http://www.w3.org/2000/svg" width="56" height="56"><g fill="none" fillRule="nonzero"><path fill="#FF5562" d="M8.75 0h28l14 14v38.5a3.5 3.5 0 0 1-3.5 3.5H8.75a3.5 3.5 0 0 1-3.5-3.5v-49A3.5 3.5 0 0 1 8.75 0"/><path fill="#FFBBC0" d="m36.75 0 14 14h-10.5a3.5 3.5 0 0 1-3.5-3.5z"/><path fill="#FFF" d="M31.035 17.988c6.027-.802 6.953 6.832 2.123 11.713l-1.57 1.522-.51.488c.155.59.323 1.197.504 1.82l.26.877c.21.698.46 1.403.744 2.1l.06.146.656.237.632.238.61.238.296.12.575.24.551.242c.18.08.356.16.528.242l.504.243.48.245c3.898 2.044 5.272 4.217 3.596 6.649-1.47 2.135-3.789 1.84-5.943-.105-1.58-1.428-3.177-3.783-4.421-6.466l-1.578-.37-.883-.203-.88-.2-1.757-.389-1.023-.218-.536.413-.264.2-.522.385c-.258.188-.513.37-.764.543l-.496.339-.245.161-.482.31c-.16.099-.317.195-.472.288l-.462.268c-3.427 1.935-6 2.113-7.582-.15-1.945-2.78-.795-5.056 2.235-5.871 1.95-.525 4.77-.507 7.25-.054l.392.076 1.28.267.498-.41.437-.367.437-.373a95.822 95.822 0 0 0 2.697-2.413l.165-.155c-.727-3.06-1.071-5.63-.946-7.663.18-2.933 1.395-4.88 3.826-5.203m3.568 22.239-.193-.083.026.044c.795 1.293 1.647 2.377 2.455 3.107 1.133 1.024 1.659 1.09 2.022.564.401-.584-.138-1.418-1.886-2.439l-.366-.206a17.34 17.34 0 0 0-.195-.105l-.415-.214-.449-.218-.482-.223zm-13.497-3.524-.062-.01c-1.934-.268-4.006-.24-5.363.125-1.41.38-1.566.688-.766 1.832.457.653 1.587.583 3.259-.205l.395-.194c.405-.207.838-.453 1.298-.736l.469-.296.241-.158zm7.802-2.975-.26.236c-.37.335-.737.661-1.102.98l-.364.314.064.014-.016.012.712.159 1.446.33-.127-.291.188.064-.12-.381-.269-.907zm2.256-5.746c3.533-3.433 3.046-7.768.217-7.392-1.117.15-1.65 1.514-1.564 3.931l.023.466c.026.398.067.821.122 1.27l.075.55.089.574.103.597.119.62.03.146z"/></g></svg>
                  <Box className='text-[#000C25] text-lg mn-4px'>文档名称.doc</Box>
                  <Box className='mb-36px text-[#646A73]'>作业指导书</Box>
                  <Button><span className="text-lg mr-4px">前往查看</span><ArrowForwardIos fontSize="small" /></Button>
                </Box>
              </Grid> */}
            </>
          }
        </Grid>
      </DialogContent>
    }
  </Dialog>
}

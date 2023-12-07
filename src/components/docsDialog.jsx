import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { ArrowForwardIos } from "@mui/icons-material"
import { Close } from "@mui/icons-material"
import { Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, Skeleton } from "@mui/material"
import { useEffect, useState } from "react"

function getExt(filename) {
  const ext = filename.split('.').slice(-1)[0]

  const fileType = {
    doc: ['doc', 'docx'],
    xls: ['csv', 'xls', 'xlsx'],
    pdf: ['pdf'],
  }

  let finalExt = ''

  Object.keys(fileType).forEach((k) => {
    if(fileType[k].map((t) => t.toLowerCase()).includes(ext.toLowerCase())) {
      finalExt = k
    }
  })

  if(finalExt === '') {
    finalExt = 'unknow'
  }

  return finalExt
}

export const Docs = ({ open, onClose, task }) => {
  const [previewIng, setPreviewIng] = useState(false)

  const [docs, setDocs] = useState(null)
  const [curDoc, setCurDoc] = useState(null)
  const [loadingDoc, setLoadingDoc] = useState(false)

  const { config } = useConfigStore()

  const api = useApi(config.serveUrl)
  const docApi = useApi(config.serveUrl, { responseType: 'blob' })

  useEffect(() => {
    api().GetDocument({
      ProdstdaGuid: task.ProdstdaGuid,
      ProductGuid: task.ProductGuid,
      ProductVersion: task.ProductVersion,
    }).then((res) => {
      setDocs(res.data.map((d) => ({ ...d, ext: getExt(d.DocumentName) })))
    })
  }, [])

  const openDoc = (doc) => {
    setLoadingDoc(true)
    docApi().GetDocumentContent({
      FileKey: doc.FileKey,
    }).then((res) => {
      // const fr = new FileReader()
      // fr.readAsDataURL(res)
      // fr.addEventListener('load', (e) => {
      //   const pdf = pdfjs.getDocument({ data: e.target.result })
      //   pdf.promise.then((pdf) => {
      //     console.log(pdf)
      //   })
      // })
      setCurDoc({
        ...doc,
        data: res,
      })
      setPreviewIng(true)
    }).finally(() => setLoadingDoc(false))
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
            <span>{curDoc.DocumentName}</span>
          </Box>
        </Box>
        <Button color="info" variant="contained" className="w-136px h-56px" size="large" sx={{marginTop:'24px'}} onClick={() => setPreviewIng(false)}><span className="text-2xl">退出</span></Button>
      </DialogContent>
      :
      <DialogContent className='w-840px' sx={{marginTop:'16px', marginBottom:'24px'}}>
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
                  return <Grid key={d.DocumentCode} item xs={4}>
                    <Box className='border border-[#CECECE] p-24px mt-16px h-full flex flex-col'>
                      {
                        d.ext === 'doc'
                        ?
                        <svg className="mb-19px w-56px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><g fill="none" fillRule="nonzero"><path fill="#2F97FE" d="M5 0h16l8 8v22a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2"/><path fill="#97C6FF" d="m21 0 8 8h-6a2 2 0 0 1-2-2z"/><path fill="#FFF" d="M7.565 13.031h2.77l2.264 8.4 2.243-8.4h2.309l2.243 8.4 2.265-8.4h2.769L20.602 24.4h-2.333l-2.264-8.31-2.287 8.31h-2.33z"/></g></svg>
                        :
                        d.ext === 'xls'
                        ?
                        <svg className="mb-19px" xmlns="http://www.w3.org/2000/svg" width="56" height="56"><g fill="none" fillRule="evenodd"><g fillRule="nonzero"><path fill="#00B632" d="M8.75 0h28l14 14v38.5a3.5 3.5 0 0 1-3.5 3.5H8.75a3.5 3.5 0 0 1-3.5-3.5v-49A3.5 3.5 0 0 1 8.75 0"/><path fill="#7FDA98" d="m36.75 0 14 14h-10.5a3.5 3.5 0 0 1-3.5-3.5z"/></g><path fill="#FFF" d="m21.875 20.125 6.124 8.575 6.126-8.575h5.25l-8.751 12.25 8.751 12.25h-5.25L28 36.049l-6.125 8.576h-5.25l8.75-12.25-8.75-12.25z"/></g></svg>
                        :
                        d.ext === 'pdf'
                        ?
                        <svg className="mb-19px" xmlns="http://www.w3.org/2000/svg" width="56" height="56"><g fill="none" fillRule="nonzero"><path fill="#FF5562" d="M8.75 0h28l14 14v38.5a3.5 3.5 0 0 1-3.5 3.5H8.75a3.5 3.5 0 0 1-3.5-3.5v-49A3.5 3.5 0 0 1 8.75 0"/><path fill="#FFBBC0" d="m36.75 0 14 14h-10.5a3.5 3.5 0 0 1-3.5-3.5z"/><path fill="#FFF" d="M31.035 17.988c6.027-.802 6.953 6.832 2.123 11.713l-1.57 1.522-.51.488c.155.59.323 1.197.504 1.82l.26.877c.21.698.46 1.403.744 2.1l.06.146.656.237.632.238.61.238.296.12.575.24.551.242c.18.08.356.16.528.242l.504.243.48.245c3.898 2.044 5.272 4.217 3.596 6.649-1.47 2.135-3.789 1.84-5.943-.105-1.58-1.428-3.177-3.783-4.421-6.466l-1.578-.37-.883-.203-.88-.2-1.757-.389-1.023-.218-.536.413-.264.2-.522.385c-.258.188-.513.37-.764.543l-.496.339-.245.161-.482.31c-.16.099-.317.195-.472.288l-.462.268c-3.427 1.935-6 2.113-7.582-.15-1.945-2.78-.795-5.056 2.235-5.871 1.95-.525 4.77-.507 7.25-.054l.392.076 1.28.267.498-.41.437-.367.437-.373a95.822 95.822 0 0 0 2.697-2.413l.165-.155c-.727-3.06-1.071-5.63-.946-7.663.18-2.933 1.395-4.88 3.826-5.203m3.568 22.239-.193-.083.026.044c.795 1.293 1.647 2.377 2.455 3.107 1.133 1.024 1.659 1.09 2.022.564.401-.584-.138-1.418-1.886-2.439l-.366-.206a17.34 17.34 0 0 0-.195-.105l-.415-.214-.449-.218-.482-.223zm-13.497-3.524-.062-.01c-1.934-.268-4.006-.24-5.363.125-1.41.38-1.566.688-.766 1.832.457.653 1.587.583 3.259-.205l.395-.194c.405-.207.838-.453 1.298-.736l.469-.296.241-.158zm7.802-2.975-.26.236c-.37.335-.737.661-1.102.98l-.364.314.064.014-.016.012.712.159 1.446.33-.127-.291.188.064-.12-.381-.269-.907zm2.256-5.746c3.533-3.433 3.046-7.768.217-7.392-1.117.15-1.65 1.514-1.564 3.931l.023.466c.026.398.067.821.122 1.27l.075.55.089.574.103.597.119.62.03.146z"/></g></svg>
                        :
                        <svg width="56" height="56" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><path d="M0 0h64v64H0z"/><path d="M10 0h32l16 16v44a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4Z" fill="#8F959E" fillRule="nonzero"/><g fill="#FFF"><path d="M31.966 51.68a3.344 3.344 0 1 1 0-6.688 3.344 3.344 0 0 1 0 6.689ZM36.781 36.866a8.16 8.16 0 0 0-2.14 2.308 7.692 7.692 0 0 0-.378 1.9c-.02.268-.016.671.01 1.21h-4.916v-1.305a8.594 8.594 0 0 1 .803-3.912 11.972 11.972 0 0 1 3.143-3.344 23.91 23.91 0 0 0 2.843-2.508c.46-.593.707-1.324.702-2.074a3.511 3.511 0 0 0-1.27-2.709 4.95 4.95 0 0 0-3.345-1.137 5.183 5.183 0 0 0-3.344 1.17 7.09 7.09 0 0 0-1.906 3.58L22 29.441a8.394 8.394 0 0 1 2.943-5.852 10.434 10.434 0 0 1 7.023-2.575c2.692-.142 5.34.73 7.424 2.441a7.357 7.357 0 0 1 2.608 5.685 6.187 6.187 0 0 1-.903 3.378 22.339 22.339 0 0 1-4.314 4.347Z"/></g><path d="m42 0 16 16H46a4 4 0 0 1-4-4V0Z" fill="#B3B9C1" fillRule="nonzero"/></g></svg>
                      }
                      <Box className='text-[#000C25] text-lg mb-4px'>{d.DocumentName}</Box>
                      <Box className='mb-24px text-[#646A73]'>{d.DocumentTypeName}</Box>
                      <div className="flex-auto"></div>
                      <div>
                        <Button disabled={loadingDoc} onClick={() => openDoc(d)}><span className="text-lg mr-4px">前往查看</span><ArrowForwardIos fontSize="small" /></Button>
                      </div>
                    </Box>
                  </Grid>
                })
              }
            </>
          }
        </Grid>
      </DialogContent>
    }
  </Dialog>
}

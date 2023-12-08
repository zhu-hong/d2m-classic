import { useApi } from "@/hook.js"
import { useConfigStore } from "@/store.jsx"
import { ArrowForwardIos } from "@mui/icons-material"
import { Close } from "@mui/icons-material"
import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, Grid, IconButton, Skeleton } from "@mui/material"
import { useRef } from "react"
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
  const [blobUrl, setBlobUrl] = useState('')

  const { config } = useConfigStore()

  const api = useApi(config.serveUrl)
  const docApi = useApi(config.serveUrl, { responseType: 'blob' })
  const [renderDoc, setRenderDoc] = useState(false)

  const pdfContainer = useRef()
  const [inFullscreen, setInFullscreen] = useState(false)

  useEffect(() => {
    api().GetDocument({
      ProdstdaGuid: task.ProdstdaGuid,
      ProductGuid: task.ProductGuid,
      ProductVersion: task.ProductVersion,
    }).then((res) => {
      setDocs(res.data.map((d) => ({ ...d, ext: getExt(d.DocumentName) })))
    })

    const onfschange = () => setInFullscreen(document.fullscreenElement!==null)

    document.addEventListener('fullscreenchange', onfschange)

    return () => {
      if(blobUrl !== '') {
        URL.revokeObjectURL(blobUrl)
      }

      document.removeEventListener('fullscreenchange', onfschange)
    }
  }, [])

  useEffect(() => {
    if(previewIng === false && blobUrl !== '') {
      URL.revokeObjectURL(blobUrl)
    }
  }, [previewIng])

  const openDoc = (doc) => {
    setLoadingDoc(true)
    docApi().GetDocumentContent({
      FileKey: doc.FileKey,
    }).then((res) => {
      const bloburl = URL.createObjectURL(res)
      setBlobUrl(bloburl)
      setCurDoc(doc)
      setRenderDoc(true)
      setPreviewIng(true)

      window.pdfjsLib.GlobalWorkerOptions.workerSrc = './pdfjs.worker.mjs'
      const loadingTask = window.pdfjsLib.getDocument(bloburl)
      loadingTask.promise.then(async (pdf) => {
        for (let index = 1; index <= pdf.numPages; index++) {
          await pdf.getPage(index).then(async (page) => {
            const viewport = page.getViewport({scale: 2});

            // Prepare canvas using PDF page dimensions
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // Render PDF page into canvas context
            const renderContext = {
              canvasContext: context,
              viewport: viewport
            };
            const renderTask = page.render(renderContext);
            await renderTask.promise.then(() => {
              setRenderDoc(false)
              pdfContainer.current.append(canvas)
            });
          })
        }
      })
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
        <Box className='mt-24px border border-[#CECECE] flex flex-col'>
          <Box className='flex items-center px-22px py-12px border-b border-[#CECECE] justify-between bg-[#F2F9F8]'>
            <span>{curDoc.DocumentName}</span>
            {
              (previewIng && !renderDoc)
              ?
              <Button onClick={() => pdfContainer.current.requestFullscreen()} variant="outlined"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><g fill="#058373" fillRule="evenodd"><path d="M11 18.111H3.889V11H2.12l-.009 8.889H11V18.11M19.889 2.111H11V3.89h7.111V11h1.769l.009-8.889Z"/></g></svg></Button>
              :
              null
            }
          </Box>
          <div className="h-500px overflow-auto flex flex-col items-center justify-start children:w-full" ref={pdfContainer}>
            {
              inFullscreen
              ?
              <Box className='flex fixed top-0 left-0 w-full items-center bg-[#F2F9F8] px-22px py-12px border-b border-[#CECECE] justify-between'>
                <span>{curDoc.DocumentName}</span>
                <Button onClick={() => document.exitFullscreen()} variant="outlined"><svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"><g fill="#058373" fillRule="evenodd"><path d="M2.111 12.778h7.111v7.11h1.77L11 11H2.111v1.778M11 11h8.889V9.222h-7.111v-7.11h-1.77L11 11"/></g></svg></Button>
              </Box>
              :
              null
            }
            {
              renderDoc
              ?
              <CircularProgress size={40} />
              :
              null
            }
          </div>
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
                docs.length > 0
                ?
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
                :
                <Grid item xs={12}>
                  <div className="h-250px flex flex-col justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="195" height="146"><g fill="none" fillRule="evenodd"><path fill="#EEF1F5" d="M97.08 112.856c50.265 0 91.013 5.433 91.013 12.135 0 6.701-40.748 12.135-91.013 12.135-50.265 0-91.012-5.434-91.012-12.135 0-6.702 40.747-12.135 91.012-12.135"/><path fill="#8F959E" fillRule="nonzero" d="M129.454 51.548a8.357 8.357 0 0 1 8.497 8.227v57.414a7.201 7.201 0 0 1-7.297 7.076H49.77a7.201 7.201 0 0 1-7.297-7.076v-67.25a7.201 7.201 0 0 1 7.297-7.075h31.2c4.949 0 8.957 3.893 8.957 8.689h39.528v-.005"/><path fill="#DFE3E9" fillRule="nonzero" d="M69.864 14.562h54.896a8 8 0 0 1 5.658 2.344l10.788 10.792a8 8 0 0 1 2.342 5.656v70.965a8 8 0 0 1-7.831 7.998l-65.684 1.385a8 8 0 0 1-8.169-7.998V22.562a8 8 0 0 1 8-8"/><path fill="#FFF" d="M75.805 31.473h52.174c.6 0 1.087.487 1.087 1.087v2.174c0 .6-.487 1.087-1.087 1.087H75.805c-.6 0-1.087-.487-1.087-1.087V32.56c0-.6.486-1.087 1.087-1.087M75.805 44.517H109.5c.6 0 1.087.486 1.087 1.087v2.173c0 .6-.486 1.087-1.087 1.087H75.805c-.6 0-1.087-.486-1.087-1.087v-2.173c0-.6.486-1.087 1.087-1.087M75.805 57.56h23.913c.6 0 1.087.487 1.087 1.087v2.174c0 .6-.487 1.087-1.087 1.087H75.805c-.6 0-1.087-.487-1.087-1.087v-2.174c0-.6.486-1.087 1.087-1.087"/><path fill="#000" fillRule="nonzero" d="M73.789 64.736h82.47c3.585 0 5.491 2.491 4.248 5.563l-18.548 45.893c-1.238 3.072-5.155 5.564-8.74 5.564H50.743c-3.586 0-5.487-2.492-4.244-5.564L65.043 70.3c1.243-3.072 5.155-5.563 8.746-5.563" opacity=".1"/><path fill="#8F959E" fillRule="nonzero" d="M76.724 67.671h82.47c3.586 0 5.491 2.491 4.248 5.563l-18.547 45.894c-1.239 3.072-5.155 5.563-8.741 5.563H53.679c-3.585 0-5.486-2.491-4.243-5.563l18.543-45.894c1.243-3.072 5.155-5.563 8.745-5.563"/><path fill="#D2D4D8" fillRule="nonzero" d="M118.473 82.84a1.733 1.733 0 0 1-1.522-.725 2.045 2.045 0 0 1-.058-1.92l.96-2.319a4.214 4.214 0 0 1 3.524-2.477h28.253a1.757 1.757 0 0 1 1.521.725c.338.59.36 1.31.058 1.92l-.96 2.323a4.21 4.21 0 0 1-3.528 2.472h-28.248"/><path fill="#FFD500" d="M163.667 115.965s-6.846-1.77-8.339-7.803c0 0 10.614-2.029 10.922 8.334l-2.583-.53"/><path fill="#FFD500" d="M163.357 115.27s-4.068-6.893-.488-13.336c0 0 6.861 4.668 3.813 13.349l-3.325-.013"/><path fill="#FFD500" d="M165.036 116.476s2.38-8.146 9.578-9.688c0 0 1.35 5.316-4.657 9.708l-4.921-.02"/><path fill="#8F959E" d="m160.182 115.283 1.327 9.667 8.36.04 1.234-9.662z"/><g fillRule="nonzero"><path fill="#000" fillOpacity=".1" d="M24.27 111.642c0 10.053 8.15 18.203 18.202 18.203 10.053 0 18.203-8.15 18.203-18.203 0-10.053-8.15-18.202-18.202-18.202-10.053 0-18.203 8.149-18.203 18.202"/><path fill="#FFD500" d="M26.697 109.215c0 10.053 8.15 18.203 18.203 18.203 10.052 0 18.202-8.15 18.202-18.203 0-10.053-8.15-18.202-18.202-18.202-10.053 0-18.203 8.149-18.203 18.202"/><path fill="#FFF" d="M52.92 101.188a1.581 1.581 0 0 1 0 2.257l-5.861 5.78 5.86 5.78a1.58 1.58 0 0 1 .084 2.125l-.104.112a1.634 1.634 0 0 1-2.269.02l-5.859-5.78-5.584 5.507a1.633 1.633 0 0 1-1.573.435 1.607 1.607 0 0 1-1.156-1.14 1.582 1.582 0 0 1 .441-1.552l5.583-5.507-5.583-5.507a1.583 1.583 0 0 1-.474-1.399l.033-.153c.148-.558.59-.994 1.156-1.14a1.633 1.633 0 0 1 1.573.435l5.583 5.507 5.86-5.78a1.635 1.635 0 0 1 2.29 0"/></g></g></svg>
                    <span className="text-[#8F959E]">暂无文档</span>
                  </div>
                </Grid>
              }
            </>
          }
        </Grid>
      </DialogContent>
    }
  </Dialog>
}

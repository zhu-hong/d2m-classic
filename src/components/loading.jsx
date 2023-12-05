import { CircularProgress } from "@mui/material"

export default () => {
  return <div className="w-full h-full flex justify-center items-center bg-no-repeat bg-cover bg-center" style={{backgroundImage:'url(./banner.png)'}}>
    <CircularProgress size={100} />
  </div>
}

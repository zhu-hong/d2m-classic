import axios from 'axios'
import { enqueueSnackbar } from 'notistack'

export function createApi(serveUrl, config = {}) {
  const ins = axios.create({
    baseURL: `http://${serveUrl}/webapi/api/D2MITC`,
    ...config,
  })
  ins.interceptors.response.use(
    (res) => {
      if(res.data.code !== 0) {
        if(res.request.responseURL.includes('AndonResponseValidate') && res.data.code === 2) {
          // 选停机
          return res.data
        }
        if(res.request.responseURL.includes('GetDocumentContent')) {
          // 文档二进制
          return res.data
        }
        if(res.request.responseURL.includes('GetDefaultDocumentContent')) {
          return res
        }
        enqueueSnackbar(res.data.msg, {
          variant: 'error',
        })
      }
      return res.data
    },
    (err) => {
      enqueueSnackbar('网络错误，请稍后重试', { variant: 'error' })
      throw err
    }
  )
  
  return {
    /**
     * 获取区域列表
     */
    async GetWorkshop() {
      return await ins.post('/GetWorkshop')
    },
    /**
     * 获取一体机列表
     * @param {{WorkshopGuid:string}} paylod 
     */
    async GetMachine(paylod) {
      return await ins.post('/GetMachine', paylod)
    },
    /**
     * 获取一体机下配置的工作中心工位列表
     * @param {{MachineGuid:string}} paylod 
     */
    async GetMachineDetail(paylod) {
      const res = await ins.post('/GetMachineDetail', paylod)
      // await delay(3000)
      // const res = {
      //   data:[
      //     {
      //       workcenterGuid:'12312ewqw',
      //       workcenterCode:'dq324rdxcsc',
      //       workcenterName:'都是分开了世啊请问·肤科技还是肯德基复活卡',
      //       worksattions: [
      //         {
      //           workstationGuid:'12312esdfwwqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是分dsfsdfsdf护肤科技还是肯德基复活卡'
      //         },
      //         {
      //           workstationGuid:'123werwe12ewqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是分'
      //         },
      //         {
      //           workstationGuid:'12312ewqsdf23w',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是的护肤科技还是肯德基复活卡'
      //         },
      //       ],
      //     },
      //     {
      //       workcenterGuid:'12swer23rs312werewqw',
      //       workcenterCode:'dq324sdfrdxcsc',
      //       workcenterName:'打实的s的护肤科技还是肯德基复活卡',
      //       worksattions: [
      //         {
      //           workstationGuid:'1231asd1242ewqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是2阿斯顿发是肯德基复活卡'
      //         },
      //         {
      //           workstationGuid:'123123q24234ewqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是分开方方v还是肯德基复活卡'
      //         },
      //         {
      //           workstationGuid:'12312234fewqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是分开了世1还是肯德基复活卡'
      //         },
      //       ],
      //     },
      //     {
      //       workcenterGuid:'1231sdfdwer3wefg2ewqw',
      //       workcenterCode:'dq324fw3ssrdxcsc',
      //       workcenterName:'都是分开千瓦时科技还是肯德基复活卡',
      //       worksattions: [
      //         {
      //           workstationGuid:'123r23fsdaf12ewqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是分开了1德基复活卡'
      //         },
      //         {
      //           workstationGuid:'12312r68jfewqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是分恶让我放松地方科技还是肯德基复活卡'
      //         },
      //         {
      //           workstationGuid:'1231fty656fgh2ewqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是分开阿迪十二日护肤科技还是肯德基复活卡'
      //         },
      //       ],
      //     },
      //     {
      //       workcenterGuid:'12323412567ghjyewqw',
      //       workcenterCode:'dq324sdf23rdxcsc',
      //       workcenterName:'都是分开了世还是肯德基复活卡都是分开了世界的护肤科技还是肯德基复活卡',
      //       worksattions: [
      //         {
      //           workstationGuid:'1231yui78.lo2ewqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是分开了世啊的杀还是肯德基复活卡'
      //         },
      //         {
      //           workstationGuid:'12312y89ohkl;ewqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是分开了世啊的肤科技还是肯德基复活卡'
      //         },
      //         {
      //           workstationGuid:'12312yuoipyjkewqw',
      //           workstationCode:'dq324rdxcsc',
      //           workstationName:'都是分开了世啊的杀手界的护肤科技还是肯德基复活卡'
      //         },
      //       ],
      //     },
      //   ],
      // }

      const Workstations = res.data.map((c) => {
        return c.Workstations.map((s) => ({
          ...s,
          WorkcenterGuid: c.WorkcenterGuid,
          WorkcenterCode: c.WorkcenterCode,
          WorkcenterName: c.WorkcenterName,
        }))
      }).flat()
      return {
        ...res,
        Workcenters: res.data,
        Workstations,
      }
    },
    /**
     * 获取工作中心生产信息
     * @param {{WorkcenterGuid:string}} paylod 
     */
    async GetWorkcenterProductionInformation(paylod) {
      return await ins.post('/GetWorkcenterProductionInformation', paylod)
    },
    /**
     * 获取签到员工
     * @param {{MachineGuid:string;WorkcenterGuid:string;}} paylod 
     */
    async GetLoginUser(paylod) {
      return await ins.post('/GetLoginUser', paylod)
    },
    /**
     * 员工签到
     * @param {{MachineGuid:string;WorkcenterGuid:string;WorkstationGuid:string;Code:string;}} paylod 
     */
    async PersonLogin(paylod) {
      return await ins.post('/PersonLogin', paylod)
    },
    /**
     * 员工签退
     * @param {{MachineGuid:string;WorkcenterGuid:string;WorkstationGuid:string;Code:string;}} paylod 
     */
    async PersonLogout(paylod) {
      return await ins.post('/PersonLogout', paylod)
    },
    /**
     * 员工统一签退
     * @param {{MachineGuid:string;WorkcenterGuid:string;Code:string;}} paylod 
     */
    async PersonUnifiedLogout(paylod) {
      return await ins.post('/PersonUnifiedLogout', paylod)
    },
    /**
     * 判断员工是否已签到
     * @param {{WorkstationGuid:string;Code:string;}} paylod 
     */
    async IsLogin(paylod) {
      return await ins.post('/IsLogin', paylod)
    },
    /**
     * 获取任务信息
     * @param {{TaskGuid:string}} paylod 
     */
    async GetTaskInformation(paylod) {
      return await ins.post('/GetTaskInformation', paylod)
    },
    /**
     * 开启任务校验
     * @param {{WorkcenterGuid:string;TaskGuid:string;}} paylod 
     */
    async StartTaskValidate(paylod) {
      return await ins.post('/StartTaskValidate', paylod)
    },
    /**
     * 开启任务
     * @param {{WorkcenterGuid:string;TaskGuid:string;}} paylod 
     */
    async StartTask(paylod) {
      return await ins.post('/StartTask', paylod)
    },
    /**
     * 工位开启生产校验
     * @param {{WorkcenterGuid:string;TaskGuid:string;workstationGuid:string;}} paylod 
     */
    async WorkstationStartValidate(paylod) {
      return await ins.post('/WorkstationStartValidate', paylod)
    },
    /**
     * 工位开启生产
     * @param {{WorkcenterGuid:string;TaskGuid:string;workstationGuid:string;}} paylod 
     */
    async WorkstationStart(paylod) {
      return await ins.post('/WorkstationStart', paylod)
    },
    /**
     * 工位停止生产
     * @param {{WorkcenterGuid:string;TaskGuid:string;workstationGuid:string;}} paylod 
     */
    async WorkstationClose(paylod) {
      return await ins.post('/WorkstationClose', paylod)
    },
    /**
     * 关闭任务
     * @param {{WorkcenterGuid:string;TaskGuid:string;}} paylod 
     */
    async CloseTask(paylod) {
      return await ins.post('/CloseTask', paylod)
    },
    /**
     * 工位报工验证
     * @param {{MachineGuid:string;WorkcenterGuid:string;Code:string;}} paylod 
     */
    async WorkstationReportValidate(paylod) {
      return await ins.post('/WorkstationReportValidate', paylod)
    },
    /**
     * 工位报工
     * @param {{WorkcenterGuid:string;TaskGuid:string;SchedulingGuid:string;WorkstationGuid:string;QualifiedAmount:number;UnqualifiedAmount:number;}} paylod 
     */
    async WorkstationReport(paylod) {
      return await ins.post('/WorkstationReport', paylod)
    },
    /**
     * 获取工作中心班次信息
     * @param {{WorkcenterGuid:string;}} paylod 
     */
    async GetShift(paylod) {
      return await ins.post('/GetShift', paylod)
    },
    /**
     * 获取文档列表
     * @param {{ProductGuid:string;ProductVersion:string;ProdstdaGuid:string;}} paylod 
     */
    async GetDocument(paylod) {
      return await ins.post('/GetDocument', paylod)
    },
    /**
     * 获取默认文档内容
     * @param {{ProductGuid:string;ProductVersion:string;ProdstdaGuid:string;}} paylod 
     */
    async GetDefaultDocumentContent(paylod) {
      return await ins.get('/GetDefaultDocumentContent', {
        params: paylod,
      })
    },
    /**
     * 获取文档内容
     * @param {{FileKey:string;}} paylod 
     */
    async GetDocumentContent(paylod) {
      return await ins.get('/GetDocumentContent', {
        params: paylod,
      })
    },
    /**
     * 获取安灯列表
     * @param {{WorkcenterGuid:string;}} paylod 
     */
    async GetAndon(paylod) {
      return await ins.post('/GetAndon', paylod)
    },
    /**
     * 获取安灯类别列表
     */
    async GetAndonType() {
      return await ins.post('/GetAndonType')
    },
    /**
     * 获取安灯定义列表
     * @param {{WorkshopGuid:string;AndonTypeGuid:string;}} paylod 
     */
    async GetAndonItem(paylod) {
      return await ins.post('/GetAndonItem', paylod)
    },
    /**
     * 安灯触发校验
     * @param {{MachineGuid:string;Code:string;}} paylod 
     */
    async AndonTriggerValidate(paylod) {
      return await ins.post('/AndonTriggerValidate', paylod)
    },
    /**
     * 安灯触发
     * @param {{workstationGuid:string;AndonItemGuid:string;EmployeeGuid:string;EmployeeName:string;}} paylod 
     */
    async AndonTrigger(paylod) {
      return await ins.post('/AndonTrigger', paylod)
    },
    /**
     * 安灯响应校验
     * @param {{AndonGuid:string;Code:string;}} paylod 
     */
    async AndonResponseValidate(paylod) {
      return await ins.post('/AndonResponseValidate', paylod)
    },
    /**
     * 安灯响应
     * @param {{AndonGuid:string;Code:string;}} paylod 
     */
    async AndonResponse(paylod) {
      return await ins.post('/AndonResponse', paylod)
    },
    /**
     * 安灯解决校验
     * @param {{AndonGuid:string;Code:string;}} paylod 
     */
    async AndonSolveValidate(paylod) {
      return await ins.post('/AndonSolveValidate', paylod)
    },
    /**
     * 安灯解决
     * @param {{AndonGuid:string;EmployeeGuid:string;EmployeeName:string;AndonFaultTypeGuid:string;AndonFaultTypeName:string;AndonFaultGuid:string;AndonFaultName:string;}} paylod 
     */
    async AndonSolve(paylod) {
      return await ins.post('/AndonSolve', paylod)
    },
    /**
     * 获取安灯故障列表
     * @param {{AndonItemGuid:string;}} paylod 
     */
    async GetAndonFault(paylod) {
      return await ins.post('/GetAndonFault', paylod)
    },
    /**
     * 安灯关闭校验
     * @param {{AndonGuid:string;Code:string;}} paylod 
     */
    async AndonCloseValidate(paylod) {
      return await ins.post('/AndonCloseValidate', paylod)
    },
    /**
     * 安灯关闭
     * @param {{AndonGuid:string;EmployeeGuid:string;EmployeeName:string;IsPass:number;}} paylod 
     */
    async AndonClose(paylod) {
      return await ins.post('/AndonClose', paylod)
    },
    /**
     * 获取设备列表
     * @param {{MachineGuid:string;WorkcenterGuid:string;}} paylod 
     */
    async GetEquipment(paylod) {
      return await ins.post('/GetEquipment', paylod)
    },
    /**
     * 获取设备详情
     * @param {{EquipmentGuid:string;}} paylod 
     */
    async GetEquipmentInformation(paylod) {
      return await ins.post('/GetEquipmentInformation', paylod)
    },
    /**
     * 设备调机
     * @param {{EquipmentGuid:string;}} paylod 
     */
    async EquipmentDebug(paylod) {
      return await ins.post('/EquipmentDebug', paylod)
    },
    /**
     * 获取设备点检项
     * @param {{EquipmentGuid:string;}} paylod 
     */
    async GetEquipmentCheckItem(paylod) {
      return await ins.post('/GetEquipmentCheckItem', paylod)
    },
    /**
     * 获取设备点检项
     * @param {{OrdercaGuid:string;Value:string;Result:string}[]} paylod 
     */
    async EquipmentCheck(paylod) {
      return await ins.post('/EquipmentCheck', paylod)
    },
  }
}

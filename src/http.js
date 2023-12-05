import axios from 'axios'

let serveUrl = '/D2MITC'

const ins = axios.create({
  baseURL: serveUrl,
})
ins.interceptors.response.use((res) => res.data)

const api = {
  /**
   * 获取区域列表
   */
  async GetWorkshop() {
    return await ins.get('/GetWorkshop')
  },
  /**
   * 获取一体机列表
   * @param {{WorkshopGuid:string}} paylod 
   */
  async GetMachine(paylod) {
    return await ins.get('/GetMachine', {
      params: paylod,
    })
  },
  /**
   * 获取一体机下配置的工作中心工位列表
   * @param {{MachineGuid:string}} paylod 
   */
  async GetMachineDetail(paylod) {
    return await ins.get('/GetMachineDetail', {
      params: paylod,
    })
  },
  /**
   * 获取工作中心生产信息
   * @param {{WorkcenterGuid:string}} paylod 
   */
  async GetWorkcenterProductionInformation(paylod) {
    return await ins.get('/GetWorkcenterProductionInformation', {
      params: paylod,
    })
  },
  /**
   * 获取任务信息
   * @param {{TaskGuid:string}} paylod 
   */
  async GetTaskInformation(paylod) {
    return await ins.get('/GetTaskInformation', {
      params: paylod,
    })
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
   * @param {{WorkcenterGuid:string;TaskGuid:string;SchedulingGuid:string;}} paylod 
   */
  async StartTask(paylod) {
    return await ins.post('/StartTask', paylod)
  },
  /**
   * 工位开启
   * @param {{WorkcenterGuid:string;TaskGuid:string;WorkstationGuid:string;}} paylod 
   */
  async WorkstationStart(paylod) {
    return await ins.post('/WorkstationStart', paylod)
  },
  /**
   * 关闭任务
   * @param {{WorkcenterGuid:string;TaskGuid:string;}} paylod 
   */
  async CloseTask(paylod) {
    return await ins.post('/CloseTask', paylod)
  },
  /**
   * 工位报工
   * @param {{WorkcenterGuid:string;TaskGuid:string;WorkstationGuid:string;QualifiedAmount:number;UnqualifiedAmount:number;}} paylod 
   */
  async CloseTask(paylod) {
    return await ins.post('/CloseTask', paylod)
  },
  /**
   * 获取工作中心班次信息
   * @param {{WorkcenterGuid:string;}} paylod 
   */
  async GetShift(paylod) {
    return await ins.get('/GetShift', {
      params: paylod,
    })
  },
  /**
   * 工作中心选择班次
   * @param {{WorkcenterGuid:string;SchedulingGuid:string;ShiftGuid:string;}} paylod 
   */
  async SelectiveShift(paylod) {
    return await ins.post('/SelectiveShift', paylod)
  },
  /**
   * 获取文档列表
   * @param {{ProductGuid:string;ProductVersion:string;ProdstdaGuid:string;}} paylod 
   */
  async GetDocument(paylod) {
    return await ins.get('/GetDocument', {
      params: paylod,
    })
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
    return await ins.get('/GetAndon', {
      params: paylod,
    })
  },
  /**
   * 获取安灯类别列表
   */
  async GetAndonType() {
    return await ins.get('/GetAndonType')
  },
  /**
   * 获取安灯定义列表
   * @param {{WorkshopGuid:string;AndonTypeGuid:string;}} paylod 
   */
  async GetAndonItem(paylod) {
    return await ins.get('/GetAndonItem', {
      params: paylod,
    })
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
   * @param {{WorkstationGuid:string;AndonItemGuid:string;EmployeeGuid:string;EmployeeName:string;}} paylod 
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
    return await ins.get('/GetAndonFault', {
      params: paylod,
    })
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
}

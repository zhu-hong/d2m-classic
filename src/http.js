import axios from 'axios'
import { enqueueSnackbar } from 'notistack'
import { delay } from './utils.js'

export function createApi(serveUrl) {
  const ins = axios.create({
    baseURL: `http://${serveUrl}`,
  })
  ins.interceptors.response.use(
    (res) => {
      if(res.data.code !== 0) {
        enqueueSnackbar(res.data.msg, {
          variant: 'error',
        })
      }
      return res.data
    },
    (err) => {
      enqueueSnackbar('网络错误', { variant: 'error' })
      throw err
    }
  )
  
  return {
    /**
     * 获取区域列表
     */
    async GetWorkshop() {
      // return await ins.get('/GetWorkshop')
      await delay(1000)
      return {
        data:[
          {
            workshopGuid:'12312ewqw',
            workshopCode:'dq324rdxcsc',
            workshopName:'都是分开了世啊的杀手界的护肤科技还是肯德基复活卡'
          },
          {
            workshopGuid:'12312werewqw',
            workshopCode:'dq324sdfrdxcsc',
            workshopName:'打实的s的护肤科技还是肯德基复活卡'
          },
          {
            workshopGuid:'1231sdfdfg2ewqw',
            workshopCode:'dq324fw3ssrdxcsc',
            workshopName:'都是分开了世界的护肤科技还是肯德基复活卡'
          },
          {
            workshopGuid:'12323412ewqw',
            workshopCode:'dq324sdf23rdxcsc',
            workshopName:'都是分开了世界的护肤科技还是肯德基复活卡都是分开了世界的护肤科技还是肯德基复活卡'
          },
        ],
      }
    },
    /**
     * 获取一体机列表
     * @param {{WorkshopGuid:string}} paylod 
     */
    async GetMachine(paylod) {
      // return await ins.get('/GetMachine', {
      //   params: paylod,
      // })
      await delay(1000)
      return {
        data:[
          {
            machineGuid:'12312ewqw',
            machineCode:'dq324rdxcsc',
            machineName:'都是分开了世啊的杀手界的护肤科技还是肯德基复活卡'
          },
          {
            machineGuid:'12312werewqw',
            machineCode:'dq324sdfrdxcsc',
            machineName:'打实的s的护肤科技还是肯德基复活卡'
          },
          {
            machineGuid:'1231sdfdfg2ewqw',
            machineCode:'dq324fw3ssrdxcsc',
            machineName:'都是分开了世界的护肤科技还是肯德基复活卡'
          },
          {
            machineGuid:'12323412ewqw',
            machineCode:'dq324sdf23rdxcsc',
            machineName:'都是分开了世界的护肤科技还是肯德基复活卡都是分开了世界的护肤科技还是肯德基复活卡'
          },
        ],
      }
    },
    /**
     * 获取一体机下配置的工作中心工位列表
     * @param {{MachineGuid:string}} paylod 
     */
    async GetMachineDetail(paylod) {
      // const res = await ins.get('/GetMachineDetail', {
      //   params: paylod,
      // })
      await delay(3000)
      const res = {
        data:[
          {
            workcenterGuid:'12312ewqw',
            workcenterCode:'dq324rdxcsc',
            workcenterName:'都是分开了世啊请问·肤科技还是肯德基复活卡',
            worksattions: [
              {
                workstationGuid:'12312esdfwwqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是分dsfsdfsdf护肤科技还是肯德基复活卡'
              },
              {
                workstationGuid:'123werwe12ewqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是分'
              },
              {
                workstationGuid:'12312ewqsdf23w',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是的护肤科技还是肯德基复活卡'
              },
            ],
          },
          {
            workcenterGuid:'12swer23rs312werewqw',
            workcenterCode:'dq324sdfrdxcsc',
            workcenterName:'打实的s的护肤科技还是肯德基复活卡',
            worksattions: [
              {
                workstationGuid:'1231asd1242ewqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是2阿斯顿发是肯德基复活卡'
              },
              {
                workstationGuid:'123123q24234ewqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是分开方方v还是肯德基复活卡'
              },
              {
                workstationGuid:'12312234fewqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是分开了世1还是肯德基复活卡'
              },
            ],
          },
          {
            workcenterGuid:'1231sdfdwer3wefg2ewqw',
            workcenterCode:'dq324fw3ssrdxcsc',
            workcenterName:'都是分开千瓦时科技还是肯德基复活卡',
            worksattions: [
              {
                workstationGuid:'123r23fsdaf12ewqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是分开了1德基复活卡'
              },
              {
                workstationGuid:'12312r68jfewqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是分恶让我放松地方科技还是肯德基复活卡'
              },
              {
                workstationGuid:'1231fty656fgh2ewqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是分开阿迪十二日护肤科技还是肯德基复活卡'
              },
            ],
          },
          {
            workcenterGuid:'12323412567ghjyewqw',
            workcenterCode:'dq324sdf23rdxcsc',
            workcenterName:'都是分开了世还是肯德基复活卡都是分开了世界的护肤科技还是肯德基复活卡',
            worksattions: [
              {
                workstationGuid:'1231yui78.lo2ewqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是分开了世啊的杀还是肯德基复活卡'
              },
              {
                workstationGuid:'12312y89ohkl;ewqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是分开了世啊的肤科技还是肯德基复活卡'
              },
              {
                workstationGuid:'12312yuoipyjkewqw',
                workstationCode:'dq324rdxcsc',
                workstationName:'都是分开了世啊的杀手界的护肤科技还是肯德基复活卡'
              },
            ],
          },
        ],
      }

      const workstations = res.data.map((c) => {
        return c.worksattions.map((s) => ({
          ...s,
          workcenterGuid: c.workcenterGuid,
          workcenterCode: c.workcenterCode,
          workcenterName: c.workcenterName,
        }))
      }).flat()
      return {
        ...res,
        workcenters: res.data,
        workstations,
      }
    },
    /**
     * 获取工作中心生产信息
     * @param {{WorkcenterGuid:string}} paylod 
     */
    async GetWorkcenterProductionInformation(paylod) {
      // return await ins.get('/GetWorkcenterProductionInformation', {
      //   params: paylod,
      // })
      await delay(3000)
      return {
        data:{
          workcenterGuid:'工作中心Guid',
          workcenterCode:'工作中心编号',
          workcenterName:'工作中心名称',
          shiftName:'班次名称',
          shiftStartTime:'班次开始时间',
          shiftEndTime:'班次结束时间',
          amount:'在岗人数',
          employees:[{
            employeeCode:'工号',
            employeeName:'姓名',
            employeePicture:'照片'
          }],
          tasks:[{
            taskGuid:'生产任务Guid',
            taskCode:'任务单号',
            orderGuid:'生产订单Guid',
            orderCode:'订单单号',
            productGuid:'产品Guid',
            productCode:'产品编号',
            productName:'产品名称',
            productVersion:'产品版本号',
            prodstdaGuid:'工艺流程Guid',
            processNumber:'制程编号',
            processCode:'工艺编号',
            processName:'工艺名称',
            planAmount:'计划数量',
            completedAmount:'完工数量',
            unitName:'单位',
            planStartTime:'计划开始时间',
            planEndTime:'计划结束时间',
            state:'状态'
          }]
        }
      }
    },
    /**
     * 获取签到员工
     * @param {{MachineGuid:string;WorkcenterGuid:string;}} paylod 
     */
    async GetLoginUser(paylod) {
      // return await ins.get('/GetLoginUser', {
      //   params: paylod,
      // })
      await delay(3000)
      return {
        data: [{
          workstationGuid:'工位Guid',
          workstationCode:'工位编号',
          workstationName:'工位名称',
          employees:[{
            employeeCode:'工234号',
            employeeName:'姓是的从v说名',
            employeePicture:'照片'
          },{
            employeeCode:'工号adsasd',
            employeeName:'姓恶趣味让风告诉对方v名',
            employeePicture:'照片'
          },{
            employeeCode:'工23号',
            employeeName:'姓请问放弃名',
            employeePicture:'照片'
          },{
            employeeCode:'工asdfc号',
            employeeName:'姓违反43额外说名',
            employeePicture:'照片'
          },{
            employeeCode:'工vsdfvz号',
            employeeName:'姓阿斯顿发送到名',
            employeePicture:'照片'
          },{
            employeeCode:'工zcvwa号',
            employeeName:'姓阿斯顿发送到名',
            employeePicture:'照片'
          },{
            employeeCode:'工asdfsdasxc号',
            employeeName:'姓asdqwedqwd阿斯顿发生名',
            employeePicture:'照片'
          },]
        },],
      }
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
     * 获取任务信息
     * @param {{TaskGuid:string}} paylod 
     */
    async GetTaskInformation(paylod) {
      // return await ins.get('/GetTaskInformation', {
      //   params: paylod,
      // })
      await delay(3000)
      return {
        data: {
          taskGuid:'生产任务Guid',
          taskCode:'任务单号',
          orderGuid:'生产订单Guid',
          orderCode:'订单单号',
          productGuid:'产品Guid',
          productCode:'产品编号',
          productName:'产品名称',
          productVersion:'产品版本号',
          prodstdaGuid:'工艺流程Guid',
          processNumber:'制程编号',
          processCode:'工艺编号',
          processName:'工艺名称',
          planAmount:8000,
          completedAmount:1200,
          unqualifiedAmount:340,
          unitName:'单位',
          planStartTime:'计划开始时间',
          planEndTime:'计划结束时间',
          state:'状态',
          workstations:[{
            workstationGuid:'工位Guid',
            workstationCode:'工位编号',
            workstationName:'工位名称',
            State: 1,//生产状,(1表示生产中 0表示未生产)
          }]
        }
      }
    },
    /**
     * 开启任务校验
     * @param {{WorkcenterGuid:string;TaskGuid:string;}} paylod 
     */
    async StartTaskValidate(paylod) {
      // return await ins.post('/StartTaskValidate', paylod)
      delay(3000)
      return {
        data:{
          equipment: 1,//设备调机校验结果,1表示校验通过,0表示校验不通过,
          mro:1,//MRO校验结果1表示校验通过,0表示校验不通过（暂时只返回1）,
          processParameter:1,//工艺参数校验结果,1表示校验通过,0表示校验不通过（暂时只返回1）,
          subProcess:1,//子工序校验结果 1表示校验通过,0表示校验不通过（暂时只返回1）
        }
      }
    },
    /**
     * 开启任务
     * @param {{WorkcenterGuid:string;TaskGuid:string;SchedulingGuid:string;}} paylod 
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
     * 工位报工
     * @param {{WorkcenterGuid:string;TaskGuid:string;workstationGuid:string;QualifiedAmount:number;UnqualifiedAmount:number;}} paylod 
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
}

import { create } from 'zustand'

/**
@type { 
  () => {
    config: {
      serveUrl: string;
      WorkshopName: string;
      WorkshopGuid: string;
      MachineGuid: string;
      terminalType: number;
      terminalInfo: any;
    },
    workcenters: any[],
    workstations: any[],
    setConfig(config:any): void,
    setWorkcenters(workcenters:any): void,
    setWorkstations(workstations:any): void,
  } 
}
 */
export const useConfigStore = create((set) => {
  return {
    config: {
      serveUrl: '192.168.3.168:8888',
      /**
       *  区域ID
      */
      WorkshopGuid: '',
      /**
       *  一体机ID
      */
      MachineGuid: '',
      /**
       *  终端应用类型
       * 0 工作中心
       * 1 工位
      */
      terminalType: 0,
      /**
       * 终端应用详情
      */
      terminalInfo: null,
      /**
       * 区域名称
      */
      WorkshopName: '',
    },
    workcenters: [],
    workstations: [],
    setConfig: (newConfig) => set((state) => {
      return {
        config: {
          ...state.config,
          ...newConfig,
        },
      }
    }),
    setWorkcenters: (centers) => set(() => {
      return {
        workcenters: [...centers]
      }
    }),
    setWorkstations: (stations) => set(() => {
      return {
        workstations: [...stations]
      }
    }),
  }
})

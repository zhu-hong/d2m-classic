import { create } from 'zustand'

/**
@type { 
  () => {
    config: {
      serveUrl: string;
      book: string;
      workshopGuid: string;
      machineGuid: string;
      terminalType: number;
      terminalInfo: any;
    },
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
       * 帐套
      */
      book: '',
      /**
       *  区域ID
      */
      workshopGuid: '',
      /**
       *  一体机ID
      */
      machineGuid: '',
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

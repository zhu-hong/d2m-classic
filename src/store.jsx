import { create } from 'zustand'

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
    setConfig: (newConfig) => set((state) => {
      return {
        config: {
          ...state.config,
          ...newConfig,
        },
      }
    }),
  }
})

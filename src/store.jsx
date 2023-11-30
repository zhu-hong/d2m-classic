import { create } from 'zustand'

export const useConfigStore = create((set) => {
  return {
    config: {
      mode: 0,
      serveUrl: '192.168.3.168:8888',
      account: '',
      workshopGuid: '',
      machineGuid: '',
      terminalType: 0,
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

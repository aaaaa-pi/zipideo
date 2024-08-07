import { VideoType, UpdateProgressType } from '@renderer/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore(
  'config',
  () => {
    const config = ref({
      sizes: ['1920x1080', '1024x720'],
      size: '1920x1080',
      frames: ['60', '30'],
      frame: '60',
      videoBitrate: 30,
      files: [] as VideoType[],
      saveFilePath: '',
      startForCheck: false,
      version: '',
      updateInfo: {
        speed: 0,
        percent: 0
      } as UpdateProgressType
    })
    const setSaveFilePath = (path: string) => {
      config.value.saveFilePath = path
    }

    const fetchDefaultSavePath = async () => {
      const path = await window.api.getDefaultSavePath()
      config.value.saveFilePath = path
    }

    const getCurrentVersion = async () => {
      const version = await window.api.getCurrentVersion()
      config.value.version = version
    }

    const startForCheckUpdate = () => {
      window.api.startForCheckUpdate()
    }

    const getUpdateProgress = () => {
      window.api.getUpdateProgress((_event, info: UpdateProgressType) => {
        config.value.updateInfo = info
      })
      window.api.updateDownloaded(() => {
        config.value.updateInfo = {
          speed: 0,
          percent: 0
        }
      })
    }

    return {
      config,
      fetchDefaultSavePath,
      setSaveFilePath,
      startForCheckUpdate,
      getCurrentVersion,
      getUpdateProgress
    }
  },
  {
    persist: {
      paths: [
        'config.sizes',
        'config.sizes',
        'config.frames',
        'config.frame',
        'config.saveFilePath',
        'config.version',
        'config.startForCheck'
      ]
    }
  }
)

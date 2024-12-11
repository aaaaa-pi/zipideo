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
      } as UpdateProgressType,
      openaiConfig: {
        apiKey: '',
        baseUrl: '',
        model: 'gpt-3.5-turbo'
      },
      isProcessing: false,
      processingType: '' as 'ai' | 'batch' | '',
      aiVideoProgress: 0,
      aiVideoError: '',
      currentAIVideo: null as { path: string; name: string; size: number } | null
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
      window.api.getUpdateProgress((info: UpdateProgressType) => {
        config.value.updateInfo = info
      })
      window.api.updateDownloaded(() => {
        config.value.updateInfo = {
          speed: 0,
          percent: 0
        }
      })
    }

    const setProcessingState = (isProcessing: boolean, type: 'ai' | 'batch' | '') => {
      config.value.isProcessing = isProcessing
      config.value.processingType = type
    }

    const setAIVideoProgress = (progress: number) => {
      config.value.aiVideoProgress = progress
    }

    const setAIVideoError = (error: string) => {
      config.value.aiVideoError = error
    }

    const setCurrentAIVideo = (video: { path: string; name: string; size: number } | null) => {
      config.value.currentAIVideo = video
    }

    return {
      config,
      fetchDefaultSavePath,
      setSaveFilePath,
      startForCheckUpdate,
      getCurrentVersion,
      getUpdateProgress,
      setProcessingState,
      setAIVideoProgress,
      setAIVideoError,
      setCurrentAIVideo
    }
  },
  {
    persist: {
      paths: [
        'config.sizes',
        'config.size',
        'config.frames',
        'config.frame',
        'config.saveFilePath',
        'config.version',
        'config.startForCheck',
        'config.openaiConfig'
      ]
    }
  }
)

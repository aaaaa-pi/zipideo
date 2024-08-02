import { VideoType } from '@renderer/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const config = ref({
    sizes: ['1920x1080', '1024x720'],
    size: '1920x1080',
    frames: ['60', '30'],
    frame: 60,
    files: [] as VideoType[],
    saveFilePath: ''
  })
  const setSaveFilePath = (path: string) => {
    config.value.saveFilePath = path
  }

  const fetchDefaultSavePath = async () => {
    const path = await window.api.getDefaultSavePath()
    config.value.saveFilePath = path
    console.log(config.value.saveFilePath);
  }

  return { config, fetchDefaultSavePath, setSaveFilePath }
})

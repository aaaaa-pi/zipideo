import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConfigStore = defineStore('config', () => {
  const config = ref({
    sizes: ['1920x1080', '1024x720'],
    size: '1920x1080',
    frames: [60, 30],
    frame: 60
  })

  return { config }
})

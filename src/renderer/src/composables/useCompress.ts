import { useConfigStore } from '@renderer/stores/useConfigStore'
import { VideoType, VideoState } from '@renderer/types'
import { ref } from 'vue'

export default () => {
  const { config } = useConfigStore()
  const currentVideo = ref<VideoType>()
  const getCompressFile = () => {
    currentVideo.value = config.files.find((video) => video.state == VideoState.READY)
    if (currentVideo.value) currentVideo.value.state = VideoState.COMPRESS
  }
  const progressNotice = () => {
    window.api.progressNotice((progress: number) => {
      currentVideo.value!.progress = progress
    })
  }

  const compress = () => {
    config.files.forEach((video) => {
      if (video.state === VideoState.COMPRESS) {
        video.state = VideoState.READY
      }
    })
    progressNotice()
    getCompressFile()
    window.api.compress({
      file: { ...currentVideo.value! },
      fps: Number(config.frame),
      size: config.size,
      saveDirectory: config.saveFilePath
    })
  }

  return { compress }
}

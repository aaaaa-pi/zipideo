import { useConfigStore } from '@renderer/stores/useConfigStore'
import { ElMessage } from 'element-plus'
import { VideoType, VideoState, MainProcessNoticeType } from '@renderer/types'
import { ref, toRefs } from 'vue'

export default () => {
  const { config } = useConfigStore()
  const currentVideo = ref<VideoType>()
  const { saveFilePath } = toRefs(config)
  const validate = () => {
    let messageText = ''
    if (saveFilePath.value.trim() === '') {
      messageText = '视频保存目录不能为空'
    }
    if (config.files.length === 0) {
      messageText = '请选择视频文件'
    }
    if (!currentVideo.value) {
      messageText = '视频压缩完毕'
    }
    if (messageText) {
      ElMessage({ message: messageText, type: 'warning', grouping: true })
    }
    return messageText === ''
  }
  const getCompressFile = () => {
    currentVideo.value = config.files.find((video) => video.state == VideoState.READY)
    if (currentVideo.value) currentVideo.value.state = VideoState.COMPRESS
  }
  const progressNotice = () => {
    window.api.mainProgressNotice((type: MainProcessNoticeType, data: number | string) => {
      switch (type) {
        case MainProcessNoticeType.PROGRESS:
          currentVideo.value!.progress = data as number
          break
        case MainProcessNoticeType.END:
          currentVideo.value!.state = VideoState.FINISH
          compress()
          break
        case MainProcessNoticeType.ERROR:
          currentVideo.value!.state = VideoState.FINISH
          break
      }
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
    if (validate() === false) return
    window.api.compress({
      file: { ...currentVideo.value! },
      fps: Number(config.frame),
      size: config.size,
      saveDirectory: config.saveFilePath
    })
  }

  return { compress }
}

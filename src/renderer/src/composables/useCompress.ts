import { useConfigStore } from '@renderer/stores/useConfigStore'
import { ElMessage } from 'element-plus'
import { VideoType, VideoState, MainProcessNoticeType } from '@renderer/types'
import { ref, toRefs } from 'vue'
const isRun = ref<boolean>(false)
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
    if (!currentVideo.value && config.files.length != 0) {
      messageText = '视频压缩完毕'
    }
    if (messageText) {
      ElMessage({ message: messageText, type: 'warning', grouping: true })
    }
    return messageText === ''
  }
  const getCompressFile = () => {
    currentVideo.value = config.files.find((video) => video.state == VideoState.READY)
    if (currentVideo.value) {
      currentVideo.value.state = VideoState.COMPRESS
    } else {
      isRun.value = false
    }
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
          currentVideo.value!.state = VideoState.ERROR
          ElMessage.error({ message: data as string, grouping: true })
          break
        case MainProcessNoticeType.DIREDCTORY_CHECK:
          ElMessage.warning({ message: '视频保存目录不存在', grouping: true })
          currentVideo.value!.state = VideoState.READY
          isRun.value = false
          break
        case MainProcessNoticeType.STOP:
          isRun.value = false
          break
      }
    })
  }

  const run = () => {
    if (isRun.value) return
    isRun.value = true
    compress()
  }

  const compress = () => {
    config.files.forEach((video) => {
      if (video.state === VideoState.COMPRESS) {
        video.state = VideoState.READY
      }
    })
    getCompressFile()
    if (validate() === false) return
    window.api.compress({
      file: { ...currentVideo.value! },
      fps: Number(config.frame),
      size: config.size,
      saveDirectory: config.saveFilePath
    })
  }

  return { run, isRun, progressNotice }
}

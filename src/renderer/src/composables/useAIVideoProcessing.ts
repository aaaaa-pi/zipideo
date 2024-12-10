import { ref } from 'vue'
import { MainProcessNoticeType } from '@renderer/types'
import { ElMessage } from 'element-plus'

export default function useVideoProcessing() {
  const isProcessing = ref(false)
  const progress = ref(0)
  const error = ref('')
  const currentVideoFile = ref<{ path: string; name: string } | null>(null)

  const startProcessing = async (videoFile: { path: string; name: string }, command: string) => {
    if (!command) return

    isProcessing.value = true
    currentVideoFile.value = videoFile
    try {
      error.value = ''
      progress.value = 0

      // 调用主进程处理视频
      window.api.compress({
        file: {
          path: videoFile.path,
          name: videoFile.name
        },
        command,
        saveDirectory: await window.api.getDefaultSavePath()
      })
    } catch (err) {
      error.value = err instanceof Error ? err.message : '处理视频时发生错误'
      isProcessing.value = false
    }
  }

  const setupProgressListener = () => {
    window.api.mainProgressNotice(async (type: MainProcessNoticeType, data: number | string) => {
      switch (type) {
        case MainProcessNoticeType.PROGRESS: {
          progress.value = data as number
          break
        }
        case MainProcessNoticeType.END: {
          isProcessing.value = false
          const savePath = await window.api.getDefaultSavePath()
          ElMessage.success({ message: '视频处理完成', grouping: true })
          await window.api.openFolder(savePath)
          break
        }
        case MainProcessNoticeType.ERROR: {
          error.value = data as string
          isProcessing.value = false
          ElMessage.error({ message: data as string, grouping: true })
          break
        }
        case MainProcessNoticeType.STOP: {
          isProcessing.value = false
          break
        }
      }
    })
  }

  const handleDownload = async () => {
    const savePath = await window.api.getDefaultSavePath()
    await window.api.openFolder(savePath)
  }

  return {
    isProcessing,
    progress,
    error,
    startProcessing,
    setupProgressListener,
    handleDownload
  }
}

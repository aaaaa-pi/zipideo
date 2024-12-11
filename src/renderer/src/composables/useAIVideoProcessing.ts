import { onUnmounted, computed } from 'vue'
import { MainProcessNoticeType } from '@renderer/types'
import { ElMessage } from 'element-plus'
import { IpcRendererEvent } from 'electron'
import { useConfigStore } from '@renderer/stores/useConfigStore'

export default function useVideoProcessing() {
  const { config, setProcessingState, setAIVideoProgress, setAIVideoError, setCurrentAIVideo } = useConfigStore()
  let progressListener: ((event: IpcRendererEvent, type: MainProcessNoticeType, data: number | string) => void) | null = null

  const isProcessing = computed(() => config.isProcessing && config.processingType === 'ai')
  const progress = computed(() => config.aiVideoProgress)
  const error = computed(() => config.aiVideoError)
  const currentVideo = computed(() => config.currentAIVideo)

  const startProcessing = async (videoFile: { path: string; name: string; size: number }, command: string) => {
    if (!command) return

    // 检查是否有其他处理正在进行
    if (config.isProcessing && config.processingType === 'batch') {
      ElMessage.warning({ message: '请等待批量处理完成后再进行AI处理', grouping: true })
      return
    }

    setProcessingState(true, 'ai')
    setCurrentAIVideo(videoFile)
    try {
      setAIVideoError('')
      setAIVideoProgress(0)

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
      setAIVideoError(err instanceof Error ? err.message : '处理视频时发生错误')
      setProcessingState(false, '')
    }
  }

  const setupProgressListener = () => {
    window.electron.ipcRenderer.removeAllListeners('mainProgressNotice')

    console.log('Setting up progress listener')
    progressListener = (_event: IpcRendererEvent, type: MainProcessNoticeType, data: number | string) => {
      console.log('Received progress update:', type, data)
      switch (type) {
        case MainProcessNoticeType.PROGRESS: {
          console.log('Updating progress to:', data)
          setAIVideoProgress(data as number)
          break
        }
        case MainProcessNoticeType.END: {
          setProcessingState(false, '')
          setAIVideoProgress(100)
          ElMessage.success({ message: '视频处理完成', grouping: true })
          break
        }
        case MainProcessNoticeType.ERROR: {
          setAIVideoError(data as string)
          setProcessingState(false, '')
          ElMessage.error({ message: data as string, grouping: true })
          break
        }
        case MainProcessNoticeType.STOP: {
          setProcessingState(false, '')
          break
        }
      }
    }

    window.electron.ipcRenderer.on('mainProgressNotice', progressListener)
  }

  const handleDownload = async () => {
    const savePath = await window.api.getDefaultSavePath()
    await window.api.openFolder(savePath)
  }

  onUnmounted(() => {
    window.electron.ipcRenderer.removeAllListeners('mainProgressNotice')
    progressListener = null
  })

  return {
    isProcessing,
    progress,
    error,
    currentVideo,
    startProcessing,
    setupProgressListener,
    handleDownload
  }
}

import { useConfigStore } from '@renderer/stores/useConfigStore'
import { VideoState, VideoType } from '@renderer/types'
import { UploadRequestOptions } from 'element-plus'
export default () => {
  const { config } = useConfigStore()

  const addFile = (options: UploadRequestOptions) => {
    const name = options.file.name
    const path = options.file.path
    config.files.push({ name, path, progress: 0, state: VideoState.READY })
  }

  const removeFile = (index: number) => {
    config.files.splice(index, 1)
  }

  const removeAllFile = () => {
    config.files = []
  }

  const bgColor = (video: VideoType) => {
    return {
      [VideoState.COMPRESS]: 'skyblue',
      [VideoState.ERROR]: '#f3a683',
      [VideoState.FINISH]: '#55efc4'
    }[video.state]
  }

  return { addFile, removeFile, removeAllFile, bgColor }
}

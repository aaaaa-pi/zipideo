import { ElectronAPI } from '@electron-toolkit/preload'
import { CompressOptions } from '../main/ffmpeg'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      compress: (options: CompressOptions) => void
      getDefaultSavePath: () => Promise<string>
      openFolder: (path: string) => Promise<object>
      selectDirectory: () => Promise<string>
      mainProgressNotice: (
        callback: (type: MainProcessNoticeType, data: number | string) => void
      ) => void
    }
  }
}

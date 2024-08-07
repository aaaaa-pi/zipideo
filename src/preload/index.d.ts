import { ElectronAPI } from '@electron-toolkit/preload'
import { CompressOptions } from '../main/ffmpeg'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      compress: (options: CompressOptions) => void
      stop: () => void
      getDefaultSavePath: () => Promise<string>
      openFolder: (path: string) => Promise<object>
      selectDirectory: () => Promise<string>
      mainProgressNotice: (
        callback: (type: MainProcessNoticeType, data: number | string) => void
      ) => void
      startForCheckUpdate: () => void
      CheckForUpdates: () => void
      getCurrentVersion: () => Promise<string>
      getUpdateProgress: (
        callback: (_event: IpcRendererEvent, info: UpdateProgressType) => void
      ) => void
      updateDownloaded: (callback: (_event: IpcRendererEvent) => void) => void
    }
  }
}

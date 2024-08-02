// 进程通信逻辑
import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { CompressOptions, Ffmpeg } from './ffmpeg'

ipcMain.handle('compress', (_event: IpcMainInvokeEvent, options: CompressOptions) => {
  const ffmpeg = new Ffmpeg(options)
  ffmpeg.run()
})

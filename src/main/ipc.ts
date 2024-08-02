// 进程通信逻辑
import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { CompressOptions, Ffmpeg } from './ffmpeg'
import { getDefaultSavePath, openFolder, selectDirectory } from './directory'

ipcMain.handle('compress', (_event: IpcMainInvokeEvent, options: CompressOptions) => {
  const ffmpeg = new Ffmpeg(options)
  ffmpeg.run()
})

ipcMain.handle('getDefaultSavePath', async () => {
  return getDefaultSavePath()
})

ipcMain.handle('openFolder', async (_event: IpcMainInvokeEvent, path: string) => {
  try {
    await openFolder(path)
    return { success: true }
  } catch (e) {
    return { success: false, error: e }
  }
})

ipcMain.handle('selectDirectory', async () => {
  return selectDirectory()
})

// 进程通信逻辑
import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { Ffmpeg } from './ffmpeg'
import { CompressOptions } from './../renderer/src/types'
import { getDefaultSavePath, openFolder, selectDirectory } from './directory'

ipcMain.handle('compress', (event: IpcMainInvokeEvent, options: CompressOptions) => {
  const ffmpeg = new Ffmpeg(event, options)
  ffmpeg.run()
})

ipcMain.handle('getDefaultSavePath', () => {
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

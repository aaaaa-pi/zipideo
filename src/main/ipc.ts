// 进程通信逻辑
import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'
import { Ffmpeg } from './ffmpeg'
import { CompressOptions } from './../renderer/src/types'
import { getDefaultSavePath, openFolder, selectDirectory } from './directory'

export default (win: BrowserWindow) => {
  const ffmpeg = new Ffmpeg()
  ipcMain.handle('compress', (_event: IpcMainInvokeEvent, options: CompressOptions) => {
    ffmpeg.init(win, options)
    ffmpeg.run()
  })

  ipcMain.on('stop', () => {
    ffmpeg.stop()
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
}

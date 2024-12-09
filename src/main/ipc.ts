// 进程通信逻辑
import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'
import { Ffmpeg } from './ffmpeg'
import { CompressOptions } from './../renderer/src/types'
import { getDefaultSavePath, openFolder, selectDirectory } from './directory'
import { generateFFmpegCommand } from './openai'

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

  // Add new handler for generating FFmpeg commands
  ipcMain.handle(
    'generateFFmpegCommand',
    async (_event: IpcMainInvokeEvent, prompt: string, filename: string) => {
      try {
        const result = await generateFFmpegCommand(prompt, filename)
        return { success: true, data: result }
      } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
      }
    }
  )
}

// 进程通信逻辑
import { ipcMain } from 'electron'

ipcMain.handle('compress', () => {
  console.log('111')
})

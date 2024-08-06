import { is } from '@electron-toolkit/utils'
import { BrowserWindow, dialog, shell, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'

// 自动下载更新
autoUpdater.autoDownload = false
// 退出时自动安装更新
autoUpdater.autoInstallOnAppQuit = false

export default (win: BrowserWindow) => {
  if (is.dev) return
  const checkForUpdates = (manual = false) => {
    autoUpdater.checkForUpdates().catch((error) => {
      console.error('Error checking for updates:', error)
    })

    if (manual) {
      dialog.showMessageBox({
        type: 'info',
        title: '检查更新',
        message: '正在检查更新...'
      })
    }
  }

  // 有新版本时
  autoUpdater.on('update-available', (info) => {
    dialog
      .showMessageBox({
        type: 'info',
        title: '更新提示',
        message: `发现新版本 ${info.version}，是否更新？`,
        detail: info.releaseNotes ? `更新说明：${info.releaseNotes}` : '',
        buttons: ['更新', '取消'],
        cancelId: 1
      })
      .then((res) => {
        if (res.response === 0) {
          // 开始下载更新
          autoUpdater.downloadUpdate()
        }
      })
  })

  // 没有新版本时
  autoUpdater.on('update-not-available', (info) => {
    dialog.showMessageBox({
      type: 'info',
      title: '更新提示',
      message: `当前版本 ${info.version} 已是最新版本`
    })
  })

  // 更新下载完毕
  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: '更新已就绪',
        message: '更新已下载完成，是否立即安装？',
        buttons: ['是', '否'],
        cancelId: 1
      })
      .then((res) => {
        if (res.response === 0) {
          // 退出并安装更新
          autoUpdater.quitAndInstall()
        }
      })
  })

  // 更新发生错误
  autoUpdater.on('error', (error) => {
    dialog
      .showMessageBox({
        type: 'error',
        title: '更新错误',
        message: '软件更新过程中发生错误',
        detail: error ? error.toString() : '',
        // detail: error ? 'github自动更新需要设置个人github的token，所以请手动进行下载' : '',
        buttons: ['网站下载', '取消更新'],
        cancelId: 1
      })
      .then((res) => {
        if (res.response === 0) {
          shell.openExternal('https://github.com/aaaaa-pi/zipideo/releases')
        }
      })
  })

  // 监听下载进度
  autoUpdater.on('download-progress', (progress) => {
    win.webContents.send('downloadProgress', progress)
  })

  // 监听来自渲染进程的手动检查更新请求
  ipcMain.on('startForCheckUpdate', () => {
    checkForUpdates()
  })

  // 监听来自渲染进程的手动检查更新请求
  ipcMain.on('CheckForUpdates', () => {
    checkForUpdates(true)
  })
}

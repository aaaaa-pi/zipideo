import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import ipc from './ipc'
import autoUpdater from './autoUpdater'
import fs from 'fs'
import path from 'path'
import { initializeOpenAI } from './openai'

// 添加日志记录函数
function logError(error: Error): void {
  const logDir = path.join(app.getPath('userData'), 'logs')
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true })
  }
  const logFile = path.join(logDir, `error-${new Date().toISOString().split('T')[0]}.log`)
  const logMessage = `${new Date().toISOString()} - ${error.stack || error.message}\n`
  fs.appendFileSync(logFile, logMessage)
}

async function createWindow(): Promise<BrowserWindow> {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 390,
    height: 675,
    minWidth: 390,
    show: false,
    autoHideMenuBar: true,
    alwaysOnTop: true,
    frame: false,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    // 开发环境
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    // 打开开发工具以便调试
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  try {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    const win = await createWindow()
    ipc(win)
    autoUpdater(win)

    // 处理OpenAI配置更新
    ipcMain.handle('update-openai-config', (_, config: { apiKey: string; baseUrl: string; model: string }) => {
      try {
        initializeOpenAI(config)
      } catch (error) {
        console.error('Error updating OpenAI config:', error)
        win.webContents.send('show-message', {
          type: 'error',
          message: '更新 OpenAI 配置失败：' + (error instanceof Error ? error.message : '未知错误')
        })
      }
    })

    ipcMain.handle('currentVersion', () => {
      return app.getVersion()
    })

    app.on('activate', function () {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  } catch (error) {
    console.error('Error during app initialization:', error)
    logError(error as Error)
    dialog.showErrorBox('启动错误', `应用程序启动失败: ${(error as Error).message}\n\n详细错误日志已保存到: ${app.getPath('userData')}/logs/`)
    app.quit()
  }
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

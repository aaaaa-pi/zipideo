import { app, dialog, shell } from 'electron'
import path from 'path'
import os from 'os'
import fs from 'fs'

export const getDefaultSavePath = () => {
  let basePath

  switch (process.platform) {
    case 'win32':
      basePath = path.join(os.homedir(), 'Documents', `${app.getName()} Files`)
      break
    case 'darwin':
      basePath = path.join(
        os.homedir(),
        'Library',
        'Containers',
        app.getName(),
        'Data',
        'Library',
        'Application Support',
        app.getName()
      )
      break
    case 'linux':
      basePath = path.join(os.homedir(), '.config', app.getName())
      break
    default:
      basePath = app.getPath('userData')
  }

  // 确保目录存在
  if (!fs.existsSync(basePath)) {
    fs.mkdirSync(basePath, { recursive: true })
  }

  return basePath
}

export const openFolder = async (path: string) => {
  await shell.openPath(path)
}

export const selectDirectory = async () => {
  const res = await dialog.showOpenDialog({
    title: '选择文件夹',
    properties: ['openDirectory', 'createDirectory']
  })

  return res.canceled === false ? res.filePaths[0] : ''
}

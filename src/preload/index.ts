import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { CompressOptions, MainProcessNoticeType } from './../renderer/src/types'

// Custom APIs for renderer
const api = {
  compress: (options: CompressOptions) => {
    ipcRenderer.invoke('compress', options)
  },
  stop: () => {
    ipcRenderer.send('stop')
  },
  getDefaultSavePath: () => ipcRenderer.invoke('getDefaultSavePath'),
  openFolder: (path: string) => ipcRenderer.invoke('openFolder', path),
  selectDirectory: () => ipcRenderer.invoke('selectDirectory'),
  mainProgressNotice: (callback: (type: MainProcessNoticeType, data: number | string) => void) => {
    ipcRenderer.on(
      'mainProgressNotice',
      (_event: IpcRendererEvent, type: MainProcessNoticeType, data: number | string) => {
        callback(type, data)
      }
    )
  },
  startForCheckUpdate: () => ipcRenderer.send('startForCheckUpdate'),
  CheckForUpdates: () => ipcRenderer.send('CheckForUpdates'),
  getCurrentVersion: () => ipcRenderer.invoke('currentVersion')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

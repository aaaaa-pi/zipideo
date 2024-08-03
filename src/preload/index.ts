import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { CompressOptions } from './../renderer/src/types'

// Custom APIs for renderer
const api = {
  compress: (options: CompressOptions) => {
    ipcRenderer.invoke('compress', options)
  },
  getDefaultSavePath: () => ipcRenderer.invoke('getDefaultSavePath'),
  openFolder: (path: string) => ipcRenderer.invoke('openFolder', path),
  selectDirectory: () => ipcRenderer.invoke('selectDirectory'),
  progressNotice: (callback: (progress: number) => void) => {
    ipcRenderer.on('progressNotice', (_event: IpcRendererEvent, progress: number) => {
      callback(progress)
    })
  }
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

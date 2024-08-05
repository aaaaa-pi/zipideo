export type DataType = 'size' | 'frame'

export enum MainProcessNoticeType {
  ERROR = 'error',
  END = 'end',
  PROGRESS = 'progress',
  DIREDCTORY_CHECK = 'diredctory_check'
}
// 视频状态
export enum VideoState {
  READY = 'ready',
  COMPRESS = 'compress',
  ERROR = 'error',
  FINISH = 'finish'
}

export type VideoType = {
  name: string
  path: string
  progress: number
  state: VideoState
}

export type CompressOptions = {
  file: VideoType
  fps: number
  size: string
  videoBitrate: number
  saveDirectory: string
}

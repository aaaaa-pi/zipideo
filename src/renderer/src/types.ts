export type DataType = 'size' | 'frame'

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

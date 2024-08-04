import path from 'path'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'
ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)
import { CompressOptions, MainProcessNoticeType } from './../renderer/src/types'
import { BrowserWindow, IpcMainInvokeEvent } from 'electron'

export class Ffmpeg {
  ffmpeg: ffmpeg.FfmpegCommand
  window: BrowserWindow
  constructor(
    private event: IpcMainInvokeEvent,
    private options: CompressOptions
  ) {
    this.ffmpeg = ffmpeg(this.options.file.path)
    this.window = BrowserWindow.fromWebContents(this.event.sender)!
  }
  progressEvent(progress) {
    console.log('Processing: ' + progress.percent + '% done')
    this.window.webContents.send(
      'mainProgressNotice',
      MainProcessNoticeType.PROGRESS,
      progress.percent
    )
  }
  error(err) {
    console.log('An error occurred: ' + err.message)
    this.window.webContents.send(
      'mainProgressNotice',
      MainProcessNoticeType.ERROR,
      err.message,
      'end'
    )
  }
  end() {
    console.log('Processing finished !')
    this.window.webContents.send('mainProgressNotice', MainProcessNoticeType.END)
  }
  private getSaveFilePath() {
    const info = path.parse(this.options!.file.name)
    return path.join(this.options!.saveDirectory, `${info.name}${info.ext}`)
  }
  run() {
    this.ffmpeg
      .videoCodec('libx264')
      .size(this.options.size) // 设置分辨率
      .fps(this.options.fps) // 设置帧数
      .on('progress', this.progressEvent.bind(this))
      .on('error', this.error.bind(this))
      .on('end', this.end.bind(this))
      .save(this.getSaveFilePath()) // 保存的文件路径
  }
}

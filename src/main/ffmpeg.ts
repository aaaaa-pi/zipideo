import path from 'path'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'
ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)
import { CompressOptions, MainProcessNoticeType } from './../renderer/src/types'
import { BrowserWindow } from 'electron'
import { existsSync, renameSync } from 'fs'

export class Ffmpeg {
  constructor(
    private window?: BrowserWindow,
    private options?: CompressOptions,
    private ffmpeg?: ffmpeg.FfmpegCommand
  ) {}
  init(win: BrowserWindow, options: CompressOptions) {
    this.window = win
    this.options = options
    this.ffmpeg = ffmpeg(this.options.file.path)
    return this
  }
  progressEvent(progress) {
    console.log('Processing: ' + progress.percent + '% done')
    this.window!.webContents.send(
      'mainProgressNotice',
      MainProcessNoticeType.PROGRESS,
      progress.percent
    )
  }
  error(err) {
    console.log('An error occurred: ' + err.message)
    if (err.message !== 'ffmpeg was killed with signal SIGKILL') {
      this.window!.webContents.send('mainProgressNotice', MainProcessNoticeType.ERROR, err.message)
    }
  }
  end() {
    console.log('Processing finished !')
    renameSync(this.tempFile(), this.getSaveFilePath())
    this.window!.webContents.send('mainProgressNotice', MainProcessNoticeType.END, 'end')
  }
  private getSaveFilePath() {
    const info = path.parse(this.options!.file.name)
    return path.join(this.options!.saveDirectory, `${info.name}${info.ext}`)
  }
  private tempFile() {
    return path.join(this.options!.saveDirectory, `.temp`)
  }
  private validate() {
    if (!existsSync(this.options!.saveDirectory)) {
      this.window!.webContents.send('mainProgressNotice', MainProcessNoticeType.DIREDCTORY_CHECK)
      return false
    }
    return true
  }
  stop() {
    try {
      this.ffmpeg!.kill('SIGKILL')
      this.window!.webContents.send('mainProgressNotice', MainProcessNoticeType.STOP)
    } catch (err) {
      this.window!.webContents.send('mainProgressNotice', MainProcessNoticeType.ERROR, err)
    }
  }
  run() {
    if (!this.validate()) return
    this.ffmpeg!.videoCodec('libx264')
      .format('mp4')
      .size(this.options!.size) // 设置分辨率
      .fps(this.options!.fps) // 设置帧数
      .on('progress', this.progressEvent.bind(this))
      .on('error', this.error.bind(this))
      .on('end', this.end.bind(this))
      .save(this.tempFile()) // 保存的文件路径
  }
}

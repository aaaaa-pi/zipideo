import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'
ffmpeg.setFfmpegPath(ffmpegPath.path)
ffmpeg.setFfprobePath(ffprobePath.path)
import { CompressOptions } from './../renderer/src/types'

export class Ffmpeg {
  ffmpeg: ffmpeg.FfmpegCommand
  constructor(private options: CompressOptions) {
    this.ffmpeg = ffmpeg(this.options.file.path)
  }
  progressEvent(progress) {
    console.log('Processing: ' + progress.percent + '% done')
  }
  error(err) {
    console.log('An error occurred: ' + err.message)
  }
  end() {
    console.log('Processing finished !')
  }
  run() {
    this.ffmpeg
      .videoCodec('libx264')
      .size(this.options.size) // 设置分辨率
      .fps(this.options.fps) // 设置帧数
      .on('progress', this.progressEvent.bind(this))
      .on('error', this.error.bind(this))
      .on('end', this.end.bind(this))
      .save('/path/to/file_finish.avi') // 保存的文件路径
  }
}

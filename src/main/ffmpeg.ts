import path from 'path'
import ffmpegPath from '@ffmpeg-installer/ffmpeg'
import ffprobePath from '@ffprobe-installer/ffprobe'
import ffmpeg from 'fluent-ffmpeg'
import { CompressOptions, MainProcessNoticeType } from './../renderer/src/types'
import { BrowserWindow } from 'electron'
import { renameSync, existsSync, mkdirSync } from 'fs'

ffmpeg.setFfmpegPath(ffmpegPath.path.replace('app.asar', 'app.asar.unpacked'))
ffmpeg.setFfprobePath(ffprobePath.path.replace('app.asar', 'app.asar.unpacked'))

export interface AIProcessOptions {
  file: {
    path: string
    name: string
  }
  command: string
  saveDirectory: string
}

export class Ffmpeg {
  constructor(
    private window?: BrowserWindow,
    private options?: CompressOptions | AIProcessOptions,
    private ffmpeg?: ffmpeg.FfmpegCommand
  ) {}

  init(win: BrowserWindow, options: CompressOptions | AIProcessOptions) {
    this.window = win
    this.options = options

    // 确保输入文件存在
    if (!existsSync(options.file.path)) {
      throw new Error('Input file does not exist')
    }

    // 确保输出目录存在
    if (!existsSync(options.saveDirectory)) {
      try {
        mkdirSync(options.saveDirectory, { recursive: true })
      } catch (error) {
        throw new Error('Failed to create output directory')
      }
    }

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

  end(ext: string) {
    console.log('Processing finished!')

    const tempFile = this.tempFile() + ext
    const saveFile = this.getSaveFilePath(ext)

    console.log('Checking temp file:', tempFile)
    console.log('Target save file:', saveFile)

    try {
      // 检查临时文件是否存在
      if (!existsSync(tempFile)) {
        throw new Error('Temporary file not found')
      }

      // 如果目标文件已存在，先备份
      if (existsSync(saveFile)) {
        const backupFile = `${saveFile}.bak`
        console.log('Creating backup:', backupFile)
        renameSync(saveFile, backupFile)
      }

      // 移动临时文件到目标位置
      console.log('Moving temp file to:', saveFile)
      renameSync(tempFile, saveFile)

      this.window!.webContents.send('mainProgressNotice', MainProcessNoticeType.END, 'end')
    } catch (error) {
      console.error('Error in file operations:', error)
      this.window!.webContents.send(
        'mainProgressNotice',
        MainProcessNoticeType.ERROR,
        error instanceof Error ? error.message : 'Failed to save output file'
      )
    }
  }

  private getSaveFilePath(ext: string) {
    const info = path.parse(this.options!.file.name)
    const safeName = `${info.name.replace(/[^a-zA-Z0-9]/g, '_')}${ext}`
    return path.join(this.options!.saveDirectory, safeName)
  }

  private tempFile() {
    return path.join(this.options!.saveDirectory, 'temp')
  }

  run() {
    if (!this.options) return

    if ('command' in this.options) {
      this.processWithAICommand()
    } else {
      this.processCompress()
    }
  }

  private processWithAICommand() {
    try {
      const aiOptions = this.options as AIProcessOptions
      const commandParts = aiOptions.command.split(' ')
      const tempFilePath = this.tempFile()

      console.log('Input file:', aiOptions.file.path)
      console.log('Temp file path:', tempFilePath)
      console.log('Command parts:', commandParts)

      // 获取原始命令中的输出文件扩展名
      const outputFileName = commandParts[commandParts.length - 1]
      const outputExt = path.extname(outputFileName) // 例如 .gif

      // 移除原始命令中的输入文件和输出文件
      const inputIndex = commandParts.indexOf('-i')
      if (inputIndex !== -1) {
        commandParts.splice(inputIndex, 2)
      }
      commandParts.pop() // 移除输出文件名

      // 构建新的命令
      let command = this.ffmpeg!

      // 添加所有中间参数
      commandParts.forEach(part => {
        if (part !== 'ffmpeg' && part.trim() !== '') {
          command = command.addOption(part.trim())
        }
      })

      // 使用原始输出文件的扩展名
      const tempFileWithExt = tempFilePath + outputExt

      // 添加输出选项
      command
        .outputOptions(['-y'])
        .output(tempFileWithExt)
        .on('start', (commandLine) => {
          console.log('Spawned FFmpeg with command:', commandLine)
        })
        .on('progress', (progress) => {
          console.log('Processing:', progress)
          this.progressEvent(progress)
        })
        .on('error', (err, stdout, stderr) => {
          console.error('FFmpeg error:', err.message)
          console.error('FFmpeg stderr:', stderr)
          this.error(err)
        })
        .on('end', () => {
          console.log('FFmpeg processing finished')
          this.end(outputExt)
        })
        .run()
    } catch (error) {
      console.error('Error in processWithAICommand:', error)
      this.error(error)
    }
  }

  private processCompress() {
    try {
      const compressOptions = this.options as CompressOptions
      const tempFilePath = this.tempFile() + '.mp4'

      console.log('Input file:', compressOptions.file.path)
      console.log('Temp file path:', tempFilePath)

      this.ffmpeg!
        .outputOptions(['-y'])
        .fps(compressOptions.fps)
        .size(compressOptions.size)
        .output(tempFilePath)
        .on('start', (commandLine) => {
          console.log('Spawned FFmpeg with command:', commandLine)
        })
        .on('progress', (progress) => {
          console.log('Processing:', progress)
          this.progressEvent(progress)
        })
        .on('error', (err, stdout, stderr) => {
          console.error('FFmpeg error:', err.message)
          console.error('FFmpeg stderr:', stderr)
          this.error(err)
        })
        .on('end', () => {
          console.log('FFmpeg processing finished')
          this.end('.mp4')
        })
        .run()
    } catch (error) {
      console.error('Error in processCompress:', error)
      this.error(error)
    }
  }

  stop() {
    if (this.ffmpeg) {
      try {
        this.ffmpeg.kill('SIGKILL')
        this.window!.webContents.send('mainProgressNotice', MainProcessNoticeType.STOP, 'stop')
      } catch (error) {
        console.error('Error stopping ffmpeg:', error)
      }
    }
  }
}

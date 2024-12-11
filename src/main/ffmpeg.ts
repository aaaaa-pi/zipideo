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

  end(ext: string, outputName?: string) {
    console.log('Processing finished!')

    const tempFile = this.tempFile() + ext
    const saveFile = outputName
      ? path.join(this.options!.saveDirectory, outputName + ext)
      : this.getSaveFilePath(ext)

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
      this.error(error)
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
      const tempFilePath = this.tempFile()

      // 从AI命令中提取输出文件扩展名和名称模式
      const outputParts = aiOptions.command.match(/\s(\S+\.(?:mp4|gif|mkv|avi|mov|flv|wmv))$/)?.[1]?.split('.') || []
      const outputExt = outputParts.length > 0 ? `.${outputParts.pop()}` : '.mp4'
      const outputName = outputParts.join('.')

      // 生成最终的输出文件名，保留中文字符
      const info = path.parse(aiOptions.file.name)
      const finalOutputName = outputName || info.name  // 如果没有指定输出名，使用输入文件名

      const tempFileWithExt = tempFilePath + outputExt

      // 解析命令，移除 ffmpeg 前缀和输入/输出文件部分
      let command = aiOptions.command
        .replace(/^ffmpeg\s+/, '')
        .replace(/-i\s+[^\s]+/, '')  // 移除 -i input.mp4 部分
        .replace(/\s+[^-][^/\s]*\.[^/\s]+$/, '')  // 移除输出文件名部分
        .trim()

      // 处理滤镜参数（支持 -vf 和 -filter:v 两种格式）
      const filterRegex = /(?:-vf|-filter:v)\s+(?:["']([^"']+)["']|(\S+))/g
      const matches = [...command.matchAll(filterRegex)]

      if (matches.length > 0) {
        // 提取所有滤镜参数
        const filters = matches.map(match => match[1] || match[2])

        // 移除原有的滤镜参数
        command = command.replace(filterRegex, '')

        // 重新构建滤镜参数，确保格式正确
        const filterValue = filters
          .map(filter => filter.replace(/["']/g, '')) // 移除引号
          .join(',')

        // 使用 fluent-ffmpeg 的 videoFilters 方法
        console.log('Filter value:', filterValue)

        const ffmpegCommand = this.ffmpeg!.input(aiOptions.file.path)

        ffmpegCommand
          .outputOptions(['-y'])
          .videoFilters(filterValue) // 使用 videoFilters 方法而不是命令行参数
          .outputOptions(command.trim().split(' ').filter(Boolean))
          .output(tempFileWithExt)
          .on('start', (commandLine) => {
            console.log('Spawned FFmpeg with command:', commandLine)
          })
          .on('progress', this.progressEvent.bind(this))
          .on('error', (err, stdout, stderr) => {
            console.error('FFmpeg error:', err.message)
            console.error('FFmpeg stdout:', stdout)
            console.error('FFmpeg stderr:', stderr)
            this.error(err)
          })
          .on('end', () => {
            console.log('FFmpeg processing finished')
            this.end(outputExt, finalOutputName)
          })
          .run()
      } else {
        // 如果没有滤镜参数，使用普通的命令处理
        const commandOptions = command.match(/(?:[^\s"']+|["'][^"']*["'])+/g) || []

        const ffmpegCommand = this.ffmpeg!.input(aiOptions.file.path)

        ffmpegCommand
          .outputOptions(['-y'])
          .outputOptions(commandOptions)
          .output(tempFileWithExt)
          .on('start', (commandLine) => {
            console.log('Spawned FFmpeg with command:', commandLine)
          })
          .on('progress', this.progressEvent.bind(this))
          .on('error', (err, stdout, stderr) => {
            console.error('FFmpeg error:', err.message)
            console.error('FFmpeg stdout:', stdout)
            console.error('FFmpeg stderr:', stderr)
            this.error(err)
          })
          .on('end', () => {
            console.log('FFmpeg processing finished')
            this.end(outputExt, finalOutputName)
          })
          .run()
      }
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
          console.error('FFmpeg stdout:', stdout)
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

  private processCommand(command: string, inputPath: string, outputDir: string, callback?: () => void) {
    try {
      // 从命令中提取输出文件名
      const outputMatch = command.match(/\s(\S+\.(?:mp4|gif|mkv|avi|mov|flv|wmv|gif))$/)?.[1]
      if (!outputMatch) {
        throw new Error('Cannot find output filename in command')
      }

      // 构建完整的输出路径
      const outputPath = path.join(outputDir, outputMatch)

      // 检查是否包含视频过滤器
      if (command.includes('-vf') || command.includes('filter_complex')) {
        // 提取过滤器参数
        const filterMatch = command.match(/-vf\s+"([^"]+)"|filter_complex\s+"([^"]+)"/)?.[1] || command.match(/-vf\s+([^\s]+)|filter_complex\s+([^\s]+)/)?.[1]

        if (!filterMatch) {
          throw new Error('Cannot parse filter parameter')
        }

        const ffmpegCommand = this.ffmpeg!.input(inputPath)

        // 如果是GIF转换命令，使用特殊处理
        if (filterMatch.includes('palettegen') || filterMatch.includes('paletteuse')) {
          // 使用单个复杂过滤器
          ffmpegCommand
            .videoFilters(filterMatch)
            .outputOptions(['-y'])
            .on('start', (commandLine) => {
              console.log('Spawned FFmpeg with command:', commandLine)
            })
            .on('progress', (progress) => {
              // 使用帧数来计算进度
              if (progress.frames) {
                const percent = Math.min(100, (progress.frames / 500) * 100)
                this.progressEvent({ percent })
              }
            })
            .on('error', this.error.bind(this))
            .on('end', () => {
              console.log('FFmpeg processing finished')
              this.progressEvent({ percent: 100 })
              if (callback) callback()
            })
        } else {
          // 其他过滤器命令
          ffmpegCommand
            .videoFilters(filterMatch)
            .outputOptions(['-y'])
            .on('start', (commandLine) => {
              console.log('Spawned FFmpeg with command:', commandLine)
            })
            .on('progress', this.progressEvent.bind(this))
            .on('error', this.error.bind(this))
            .on('end', () => {
              console.log('FFmpeg processing finished')
              if (callback) callback()
            })
        }

        ffmpegCommand.output(outputPath).run()
      } else {
        // 处理普通命令
        const cmdStr = command
          .replace(/^ffmpeg\s+/, '')
          .replace(/-i\s+[^\s]+/, '')
          .replace(/\s+[^-][^/\s]*\.[^/\s]+$/, '')
          .trim()

        const ffmpegCommand = this.ffmpeg!.input(inputPath)

        ffmpegCommand
          .outputOptions(['-y'])
          .outputOptions(cmdStr.split(' ').filter(Boolean))
          .output(outputPath)
          .on('start', (commandLine) => {
            console.log('Spawned FFmpeg with command:', commandLine)
          })
          .on('progress', this.progressEvent.bind(this))
          .on('error', this.error.bind(this))
          .on('end', () => {
            console.log('FFmpeg processing finished')
            if (callback) callback()
          })
          .run()
      }
    } catch (error) {
      console.error('Error in processCommand:', error)
      this.error(error)
    }
  }
}

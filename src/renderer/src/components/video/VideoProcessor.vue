<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { VideoPlay, Close, MagicStick, Refresh, Download } from '@element-plus/icons-vue'
import useVideoProcessing from '@renderer/composables/useAIVideoProcessing'
import useAICommand from '@renderer/composables/useAICommand'

interface Props {
  videoFile: {
    path: string
    name: string
    size: number
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const {
  isProcessing,
  progress,
  error,
  outputUrl,
  startProcessing,
  setupProgressListener,
  handleDownload
} = useVideoProcessing()

console.log(progress)

const {
  prompt,
  command,
  description,
  isGenerating,
  handleGenerateCommand
} = useAICommand()

// 处理生成命令
const handleGenerate = async () => {
  try {
    await handleGenerateCommand(props.videoFile.name)
  } catch (err) {
    error.value = err instanceof Error ? err.message : '发生错误'
  }
}

// 处理视频
const handleProcessVideo = () => {
  startProcessing(props.videoFile, command.value)
}

// // 重置所有状态
// const handleReset = () => {
//   prompt.value = ''
//   command.value = ''
//   description.value = ''
//   error.value = ''
//   outputUrl.value = null
// }

onMounted(() => {
  setupProgressListener()
})

// 在组件卸载时清理 URL
onUnmounted(() => {
  if (outputUrl.value) {
    URL.revokeObjectURL(outputUrl.value)
  }
})
</script>

<template>
  <div class="w-full space-y-6">
    <!-- 当前视频信息 -->
    <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
      <div class="flex items-center space-x-4">
        <div class="p-2 bg-blue-100 rounded-lg">
          <el-icon class="h-6 w-6 text-blue-600">
            <VideoPlay />
          </el-icon>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">当前视频</h2>
          <p class="text-sm text-gray-600">{{ videoFile.name }}</p>
          <p class="text-xs text-gray-500">
            {{ (videoFile.size / (1024 * 1024)).toFixed(2) }} MB
          </p>
        </div>
      </div>
      <el-button
        @click="emit('close')"
        :icon="Close"
        :disabled="isProcessing || isGenerating"
      >
      </el-button>
    </div>

    <!-- 输入区域 -->
    <div class="space-y-4">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">处理需求描述</label>
        <el-input
          v-model="prompt"
          type="textarea"
          :rows="3"
          placeholder="例如：将视频转换为黑白效果"
        />
        <p class="text-xs text-gray-500">
          请描述你想要对视频进行的处理，AI 将为你生成相应的 FFmpeg 命令
        </p>
      </div>

      <!-- 生成命令按钮 -->
      <el-button
        type="primary"
        @click="handleGenerate"
        :loading="isGenerating"
        :icon="MagicStick"
      >
        {{ isGenerating ? '生成中...' : '生成命令' }}
      </el-button>

      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
      />

      <!-- 命令显示区域 -->
      <div v-if="command" class="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-sm font-medium text-gray-700">生成的命令</h3>
            <el-button
              text
              @click="command = ''"
              size="small"
            >
              清除
            </el-button>
          </div>
          <el-input
            v-model="command"
            type="textarea"
            :rows="4"
            class="font-mono"
            spellcheck="false"
          />
        </div>

        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-2">命令说明</h3>
          <p class="text-gray-600 text-sm bg-gray-100 p-4 rounded-lg">
            {{ description }}
          </p>
        </div>

        <el-button
          type="success"
          :loading="isProcessing"
          :icon="Refresh"
          class="w-full"
          @click="handleProcessVideo"
        >
          {{ isProcessing ? '处理中...' : '开始处理' }}
        </el-button>
      </div>

      <!-- 进度条 -->
       <div>{{ progress }}</div>
      <div v-if="progress > 0" class="space-y-2 bg-blue-50 p-4 rounded-lg">
        <div class="flex justify-between text-sm text-blue-600">
          <span>处理进度</span>
          <span>{{ progress }}%</span>
        </div>
        <el-progress
          :percentage="progress"
          :show-text="false"
          :stroke-width="10"
          status="success"
        />
      </div>

      <!-- 输出结果 -->
      <div>{{ outputUrl }}</div>
      <div v-if="outputUrl" class="space-y-4 bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-medium text-gray-900">处理完成</h3>
        <div class="flex items-center space-x-4">
          <el-button
            type="primary"
            :icon="Download"
            @click="handleDownload"
          >
            打开文件位置
          </el-button>
          <p class="text-sm text-gray-500">
            文件已保存到默认目录
          </p>
        </div>
        <div class="relative rounded-lg overflow-hidden bg-black">
          <video
            controls
            class="w-full"
            :src="outputUrl"
          />
        </div>
      </div>
    </div>
  </div>
</template>

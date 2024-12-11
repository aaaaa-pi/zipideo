<script setup lang="ts">
import { onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { VideoTwo, CloseOne } from '@icon-park/vue-next'
import useVideoProcessing from '@renderer/composables/useAIVideoProcessing'
import useAICommand from '@renderer/composables/useAICommand'
import { useConfigStore } from '@renderer/stores/useConfigStore'

interface Props {
  videoFile: {
    path: string
    name: string
    size: number
  }
}

const props = defineProps<Props>()
const emit = defineEmits(['close'])

const { isProcessing, progress, error, startProcessing, setupProgressListener, handleDownload } =
  useVideoProcessing()

const { setAIVideoError } = useConfigStore()

const { prompt, command, description, isGenerating, handleGenerateCommand } = useAICommand()

// 处理生成命令
const handleGenerate = async () => {
  if (!prompt.value?.trim()) {
    setAIVideoError('请输入处理需求描述')
    return
  }

  setAIVideoError('')
  try {
    await handleGenerateCommand(props.videoFile.name)
  } catch (err) {
    setAIVideoError(err instanceof Error ? err.message : '发生错误')
  }
}

// 处理视频
const handleProcessVideo = () => {
  startProcessing(props.videoFile, command.value)
}

onMounted(() => {
  setupProgressListener()
})

const handleClose = () => {
  console.log('close')
  if (isProcessing.value || isGenerating.value) {
    return // 如果正在处理或生成中，不允许关闭
  }
  emit('close')
}
</script>

<template>
  <div class="w-full space-y-2 font-mono">
    <!-- 当前视频信息 -->
    <div
      class="flex items-center justify-between bg-white p-4 rounded-lg border-2 border-[#2a2a2a]"
    >
      <div class="flex items-center space-x-2">
        <video-two theme="outline" size="36" fill="#0a65cc" />
        <div>
          <label class="block">当前视频</label>
          <p class="text-sm text-gray-600">{{ videoFile.name }}</p>
          <p class="text-sm text-gray-500">{{ (videoFile.size / (1024 * 1024)).toFixed(2) }} MB</p>
        </div>
      </div>
      <div class="delIcon">
        <close-one
          theme="outline"
          size="15"
          :class="{ 'cursor-not-allowed': isProcessing || isGenerating }"
          @click="handleClose"
        />
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="space-y-6">
      <div class="space-y-2">
        <label class="block">处理需求描述</label>
        <el-input
          v-model="prompt"
          type="textarea"
          :rows="3"
          placeholder="例如：将视频转换为黑白效果"
          class="w-full rounded-lg border-2 border-[#2a2a2a]"
        />
      </div>

      <!-- 生成命令按钮 -->
      <el-button
        type="primary"
        :loading="isGenerating"
        color="#0a65cc"
        class="w-full hover:bg-blue-600 text-white rounded-lg h-12 text-base border-2 border-[#2a2a2a] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
        @click="handleGenerate"
      >
        {{ isGenerating ? '生成中...' : '生成命令' }}
      </el-button>

      <!-- 错误提示 -->
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        class="border-2 border-red-200"
      />

      <!-- 命令显示区域 -->
      <div v-if="command" class="space-y-4 border-2 border-[#2a2a2a] bg-white p-4 rounded-lg">
        <div>
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-bold text-[#2a2a2a]">生成的命令</h3>
            <el-button
              plain
              size="small"
              class="border-2 border-[#2a2a2a] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              @click="command = ''"
            >
              清除
            </el-button>
          </div>
          <div class="rounded-lg">
            <el-input
              v-model="command"
              type="textarea"
              :rows="4"
              class="font-mono !text-white"
              spellcheck="false"
            />
          </div>
        </div>

        <div>
          <h3 class="font-bold text-[#2a2a2a] mb-2">命令说明</h3>
          <p class="text-gray-600 text-sm border-2 border-[#2a2a2a] bg-white p-4 rounded-lg">
            {{ description }}
          </p>
        </div>

        <el-button
          type="success"
          :loading="isProcessing"
          class="w-full border-2 border-[#2a2a2a] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          @click="handleProcessVideo"
        >
          <el-icon class="mr-2"><Refresh /></el-icon>
          {{ isProcessing ? '处理中...' : '开始处理' }}
        </el-button>
      </div>

      <!-- 进度条 -->
      <div v-if="progress > 0" class="space-y-2 border-2 border-[#2a2a2a] bg-white p-4 rounded-lg">
        <div class="flex justify-between text-sm text-blue-600 font-bold">
          <span>处理进度</span>
          <span>{{ `${Math.round(progress)}%` }} </span>
        </div>
        <el-progress
          :percentage="progress"
          :show-text="false"
          :stroke-width="10"
          status="success"
        />
      </div>

      <!-- 输出结果 -->
      <div v-if="!isProcessing && progress === 100" class="space-y-4 bg-white p-4 rounded-lg">
        <h3 class="font-bold text-[#2a2a2a]">处理完成</h3>
        <div class="flex items-center space-x-4">
          <el-button
            type="primary"
            class="bg-blue-500 hover:bg-blue-600 text-white rounded-lg h-12 text-xs font-['Press_Start_2P']"
            @click="handleDownload"
          >
            打开文件位置
          </el-button>
          <p class="text-xs text-gray-500">文件已保存到默认目录</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.delIcon {
  @apply text-slate-300 hover:text-red-500 hover:scale-125 cursor-pointer duration-300;
}
</style>

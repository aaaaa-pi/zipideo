<script setup lang="ts">
import { ref } from 'vue'
import { InboxOut } from '@icon-park/vue-next'

interface Props {
  onFileSelect: (file: File) => void
  config: {
    isProcessing: boolean
    processingType: 'ai' | 'batch' | ''
  }
}

const props = defineProps<Props>()

const isDragActive = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  isDragActive.value = false

  if (e.dataTransfer?.files.length) {
    const file = e.dataTransfer.files[0]
    if (file.type.startsWith('video/') && file.size <= 2 * 1024 * 1024 * 1024) {
      props.onFileSelect(file)
    }
  }
}

const handleDragOver = (e: DragEvent) => {
  e.preventDefault()
  isDragActive.value = true
}

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault()
  isDragActive.value = false
}

const handleClick = () => {
  fileInput.value?.click()
}

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    const file = target.files[0]
    if (file.type.startsWith('video/') && file.size <= 2 * 1024 * 1024 * 1024) {
      props.onFileSelect(file)
    }
  }
}
</script>

<template>
  <div
    @drop="handleDrop"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @click="handleClick"
    class="border-dashed border-2 rounded-lg p-8 text-center transition-colors duration-200 font-mono"
    :class="[
      isDragActive
        ? 'bg-blue-50 border-blue-500'
        : props.config.isProcessing && props.config.processingType === 'batch'
        ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
        : 'bg-white hover:bg-gray-50 border-blue-500 cursor-pointer'
    ]"
  >
    <input
      ref="fileInput"
      type="file"
      accept="video/*"
      class="hidden"
      @change="handleFileChange"
      :disabled="props.config.isProcessing && props.config.processingType === 'batch'"
    />
    <div class="flex flex-col items-center gap-4">
      <inbox-out
        theme="filled"
        size="36"
        :fill="props.config.isProcessing && props.config.processingType === 'batch' ? '#9CA3AF' : '#0a65cc'"
        class="inline-block"
      />
      <div class="space-y-1">
        <p class="font-bold text-[#2a2a2a]">
          {{
            props.config.isProcessing && props.config.processingType === 'batch'
              ? '请等待批量处理完成'
              : isDragActive
                ? '释放以上传视频'
                : '拖拽视频文件到此处'
          }}
        </p>
        <p class="text-sm" :class="props.config.isProcessing && props.config.processingType === 'batch' ? 'text-gray-400' : 'text-gray-600'">
          或 <span :class="props.config.isProcessing && props.config.processingType === 'batch' ? 'text-gray-400' : 'text-blue-500 hover:text-blue-600'">浏览文件</span>
        </p>
        <p class="text-xs text-gray-500">
          支持的文件类型：所有视频格式
        </p>
        <p class="text-xs text-gray-500">
          最大文件大小：2GB
        </p>
      </div>
    </div>
  </div>
</template>

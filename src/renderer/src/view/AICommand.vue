<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/useConfigStore'
import VideoUploader from '@renderer/components/AIVideo/VideoUploader.vue'
import VideoProcessor from '@renderer/components/AIVideo/VideoProcessor.vue'

const { config, setCurrentAIVideo, setAIVideoProgress, setAIVideoError } = useConfigStore()

// 处理视频选择
const handleVideoSelect = (file: File) => {
  setCurrentAIVideo({
    path: file.path,
    name: file.name,
    size: file.size
  })
}

// 处理视频处理器关闭
const handleProcessorClose = () => {
  setCurrentAIVideo(null)
  setAIVideoProgress(0)
  setAIVideoError('')
}
</script>

<template>
  <div class="h-full p-6 flex flex-col">
    <h2 class="text-2xl font-bold mb-4 text-center font-mono">AI 视频处理</h2>
    <VideoProcessor
      v-if="config.currentAIVideo"
      :videoFile="config.currentAIVideo"
      @close="handleProcessorClose"
    />
    <VideoUploader
      v-else
      :onFileSelect="handleVideoSelect"
      :config="config"
    />
  </div>
</template>

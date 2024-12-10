<script setup lang="ts">
import { ref } from 'vue'
import VideoUploader from '@renderer/components/AIVideo/VideoUploader.vue'
import VideoProcessor from '@renderer/components/AIVideo/VideoProcessor.vue'

interface VideoFile {
  path: string
  name: string
  size: number
}

const currentVideo = ref<VideoFile | null>(null)

// 处理视频选择
const handleVideoSelect = (file: VideoFile) => {
  currentVideo.value = file
}

// 处理视频处理器关闭
const handleProcessorClose = () => {
  currentVideo.value = null
}
</script>

<template>
  <div class="h-full p-6 flex flex-col">
    <h2 class="text-2xl font-bold mb-4 text-center font-mono">AI 视频处理</h2>
    <VideoProcessor
      v-if="currentVideo"
      :videoFile="currentVideo"
      @close="handleProcessorClose"
    />
    <VideoUploader
      v-else
      :onFileSelect="handleVideoSelect"
    />
  </div>
</template>

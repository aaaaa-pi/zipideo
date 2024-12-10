<script setup lang="ts">
import { ref } from 'vue'
import VideoUploader from '@renderer/components/video/VideoUploader.vue'
import VideoProcessor from '@renderer/components/video/VideoProcessor.vue'

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
  console.log('Processor closing...')  // 添加日志
  currentVideo.value = null
}
</script>

<template>
  <div class="h-full p-6">
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

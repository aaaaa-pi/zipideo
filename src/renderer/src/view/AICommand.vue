<script setup lang="ts">
import { ref } from 'vue'
import VideoProcessor from '@renderer/components/video/VideoProcessor.vue'
import VideoUploader from '@renderer/components/video/VideoUploader.vue'

const videoFile = ref<File | null>(null)

const handleFileSelect = (file: File) => {
  videoFile.value = file
}

const handleReset = () => {
  videoFile.value = null
}
</script>

<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">AI 视频命令生成</h2>

    <div v-if="!videoFile" class="space-y-4">
      <VideoUploader :on-file-select="handleFileSelect" />
    </div>

    <VideoProcessor
      v-else
      :video-file="videoFile"
      :on-reset="handleReset"
    />
  </div>
</template>

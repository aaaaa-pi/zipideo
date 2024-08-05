<script setup lang="ts">
import useVideo from '@renderer/composables/useVideo'
import useCompress from '@renderer/composables/useCompress'
import { Eleme, VideoPlay } from '@element-plus/icons-vue'

const { removeAllFile, resetAllVideo } = useVideo()
const { run, isRun, progressNotice } = useCompress()
progressNotice()

const stop = () => {
  window.api.stop()
}
</script>

<template>
  <main class="flex justify-center">
    <el-button
      color="#27ae60"
      size="small"
      :icon="VideoPlay"
      :loading-icon="Eleme"
      :loading="isRun"
      @click="run"
      >开始转码</el-button
    >
    <el-button color="#0a65cc" size="small" @click="stop">停止转码</el-button>
    <el-button color="#ff3838" size="small" :disabled="isRun" @click="removeAllFile"
      >清空全部</el-button
    >
    <el-button color="#8e44ad" size="small" :disabled="isRun" @click="resetAllVideo"
      >重置视频</el-button
    >
  </main>
</template>

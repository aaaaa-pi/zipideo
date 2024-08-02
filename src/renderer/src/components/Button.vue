<script setup lang="ts">
import useVideo from '@renderer/composables/useVideo'

const { removeAllFile } = useVideo()
</script>

<template>
  <main class="flex justify-center">
    <el-button color="#27ae60" size="small">开始转码</el-button>
    <el-button color="#0a65cc" size="small">停止转码</el-button>
    <el-button color="#ff3838" size="small" @click="removeAllFile">清空全部</el-button>
  </main>
</template>

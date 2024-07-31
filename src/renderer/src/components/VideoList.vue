<script setup lang="ts">
import { ref } from 'vue'
import VideoItem from '@renderer/components/VideoItem.vue'
import { VideoType, VideoState } from '@renderer/types'
const videoList = ref<VideoType[]>([
  {
    name: '111',
    path: 'www.baidu.com',
    progress: 80,
    state: VideoState.READY
  },
  {
    name: '222',
    path: 'www.baidu.com',
    progress: 60,
    state: VideoState.READY
  }
])
</script>

<template>
  <main class="main">
    <p>视频列表</p>
    <section class="flex flex-auto flex-col">
      <div v-if="videoList.length">
        <VideoItem v-for="(item, index) of videoList" :key="index" :video="item" :index="index" />
      </div>
      <span v-else class="m-auto text-gray-500">暂无压缩视频</span>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.main {
  @apply bg-white overflow-y-auto h-80 rounded-lg mx-2 mb-2 flex flex-col border-dashed border-2 border-blue-500;
}
p {
  @apply m-2 text-xs text-gray-500;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { CloseOne } from '@icon-park/vue-next'
const videoList = ref([1, 2, 3, 4])
</script>

<template>
  <main class="main">
    <p>视频列表</p>
    <section class="flex flex-auto flex-col">
      <span v-if="videoList.length === 0" class="m-auto text-gray-500">暂无数据</span>
      <div v-for="(video, index) in videoList" :key="index" class="videoItem">
        {{ video }}
        <div class="icon">
          <close-one theme="outline" size="12" />
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.main {
  @apply bg-white overflow-y-auto h-80 rounded-lg mx-2 mb-2 flex flex-col border-dashed border-2 border-blue-600;
  .videoItem {
    @apply bg-slate-100 px-3 py-1 rounded-lg mb-2 mx-3 text-xs text-slate-600 border-2 border-blue-500 flex justify-between items-center;

    .icon {
      @apply text-slate-500 opacity-50 hover:scale-125 duration-300 hover:text-blue-600 hover:opacity-90 cursor-pointer;
    }
  }
}
p {
  @apply m-2 text-xs text-gray-500;
}
</style>

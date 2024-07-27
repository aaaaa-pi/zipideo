<script setup lang="ts"></script>

<template>
  <main class="main">
    <p>视频列表</p>
    <section class="flex flex-auto">
      <span class="m-auto text-gray-500">暂无数据</span>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.main {
  @apply bg-white overflow-y-auto h-80 rounded-lg mx-2 mb-2 flex flex-col border-dashed border-2 border-blue-600;
}
p {
  @apply m-2 text-xs text-gray-500;
}
</style>

<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/useConfigStore'

const { config } = useConfigStore()
</script>

<template>
  <section class="bg-[#fddfb7] text-[#cc7431] text-sm flex items-center justify-between px-5">
    <p>检查到更新，安装包下载中...</p>
    <div>
      <p>网速：{{ config.updateInfo.speed }}kb/s</p>
      <p>进度：{{ config.updateInfo.percent }}%</p>
    </div>
  </section>
</template>

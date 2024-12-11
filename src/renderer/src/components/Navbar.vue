<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/useConfigStore'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const { config } = useConfigStore()
const router = useRouter()

const handleRouteChange = (routeName: string) => {
  // 如果正在处理视频，阻止路由切换
  if (config.isProcessing) {
    const processingType = config.processingType === 'ai' ? 'AI处理' : '批量处理'
    ElMessage.warning({ message: `请等待${processingType}完成后再切换`, grouping: true })
    return
  }
  router.push({ name: routeName })
}
</script>

<template>
  <main class="text-slate-600 border-b bg-gray-50 flex justify-between px-3 py-2 drag">
    <h5 class="opacity-80" style="font-family: 'Press Start 2P', cursive">zipideo</h5>
    <section class="flex justify-between gap-2 multifont text-xs items-center">
      <a
        @click="handleRouteChange('AICommand')"
        class="nodrag cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': config.isProcessing }"
      >AI视频处理</a>
      <a
        @click="handleRouteChange('batchprocess')"
        class="nodrag cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': config.isProcessing }"
      >批量转码</a>
      <a
        @click="handleRouteChange('setting')"
        class="nodrag cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': config.isProcessing }"
      >配置</a>
    </section>
  </main>
</template>

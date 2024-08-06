<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/useConfigStore'
const { config } = useConfigStore()
const checkForUpdate = () => {
  window.api.CheckForUpdates()
}
</script>

<template>
  <section class="flex justify-between">
    <p class="text-slate-600">当前版本：{{ config.version }}</p>
    <el-button plain color="#0a65cc" @click="checkForUpdate">检查更新</el-button>
  </section>
  <section>
    <el-checkbox v-model="config.startForCheck" label="启动时检查更新" />
  </section>
</template>

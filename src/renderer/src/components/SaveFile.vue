<script setup lang="ts">
import { onMounted } from 'vue'
import { useConfigStore } from '@renderer/stores/useConfigStore'

const { config, fetchDefaultSavePath, setSaveFilePath } = useConfigStore()

const openFolder = async () => {
  await window.api.openFolder(config.saveFilePath)
}
const selectDirectory = async () => {
  const path = await window.api.selectDirectory()
  setSaveFilePath(path)
}
onMounted(async () => {
  if (!config.saveFilePath) {
    await fetchDefaultSavePath()
  }
})
</script>

<template>
  <main class="flex flex-col">
    <div class="border-[#dcdfe6] border text-slate-800 px-[12px] pt-[4px] pb-[4px] mb-3">
      {{ config.saveFilePath }}
    </div>
    <section class="flex">
      <el-button color="#0a65cc" size="default" class="flex-1" @click="selectDirectory"
        >更改</el-button
      >
      <el-button plain size="default" class="flex-1" @click="openFolder">打开文件夹</el-button>
    </section>
  </main>
</template>

<style lang="scss" scoped></style>

<script setup lang="ts">
import Actions from '@renderer/components/Actions.vue'
import Frame from '@renderer/components/Frame.vue'
import Button from '@renderer/components/Button.vue'
import VideoList from '@renderer/components/VideoList.vue'
import { onMounted } from 'vue'
import { useConfigStore } from '@renderer/stores/useConfigStore'

const { config, fetchDefaultSavePath, startForCheckUpdate, getCurrentVersion } = useConfigStore()
onMounted(async () => {
  if (!config.saveFilePath) {
    await fetchDefaultSavePath()
  }
  if (config.startForCheck) {
    startForCheckUpdate()
  }
  getCurrentVersion()
})
</script>

<template>
  <main>
    <Frame class="mt-3" />
    <Actions class="mt-5" />
    <Button class="mt-3" />
    <VideoList class="mt-5" />
  </main>
</template>

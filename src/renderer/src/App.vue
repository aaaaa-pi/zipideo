<script setup lang="ts">
import Navbar from '@renderer/components/Navbar.vue'
import Copyright from '@renderer/components/Copyright.vue'
import UpdateInfo from '@renderer/components/UpdateInfo.vue'
import { useConfigStore } from '@renderer/stores/useConfigStore'
import { onMounted } from 'vue'

const { config, getUpdateProgress } = useConfigStore()

onMounted(() => {
  getUpdateProgress()
})
</script>

<template>
  <div class="h-screen flex flex-col">
    <Navbar />
    <UpdateInfo v-if="config.updateInfo.percent !== 0" class="absolute w-full z-10" />
    <main class="flex-1 overflow-auto">
      <router-view></router-view>
    </main>
    <Copyright class="mt-3 mb-3" />
  </div>
</template>

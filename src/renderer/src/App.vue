<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Copyright from './components/Copyright.vue'
import UpdateInfo from './components/UpdateInfo.vue'
import { useConfigStore } from '@renderer/stores/useConfigStore'

const { config, getUpdateProgress } = useConfigStore()
import { onMounted } from 'vue'

onMounted(() => {
  getUpdateProgress()
})
</script>

<template>
  <main>
    <Navbar />
    <UpdateInfo v-if="config.updateInfo.percent !== 0" class="absolute w-full z-10" />
    <RouterView />
    <Copyright class="mt-3 mb-3" />
  </main>
</template>

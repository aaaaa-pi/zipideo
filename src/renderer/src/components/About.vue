<script setup lang="ts">
import { ref } from 'vue'
const checkUpdate = ref<boolean>(false)
</script>

<template>
  <section class="flex justify-between">
    <p class="text-slate-600">当前版本：1.0.1</p>
    <el-button plain color="#0a65cc">检查更新</el-button>
  </section>
  <section>
    <el-checkbox v-model="checkUpdate" label="启动时检查更新" />
  </section>
</template>

<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/useConfigStore'
const { config } = useConfigStore()
</script>

<template>
  <main class="bg-white p-3">
    <section class="flex gap-4">
      <div class="flex-auto">
        <p>分辨率</p>
        <el-select v-model="config.size" placeholder="请选择转换的分辨率">
          <el-option
            v-for="(item, index) in config.sizes"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>
      <div class="flex-auto">
        <p>帧数</p>
        <el-select v-model="config.frame" placeholder="请选择转换的帧数">
          <el-option
            v-for="(item, index) in config.frames"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </div>
    </section>
    <section class="mt-4 px-2">
      <p>码率</p>
      <el-slider v-model="config.videoBitrate" />
    </section>
  </main>
</template>

<style lang="scss" scoped>
p {
  @apply mb-2 text-xs text-gray-500;
}
</style>

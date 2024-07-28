<script setup lang="ts"></script>

<template>
  <main class="bg-white p-3">
    <section class="flex gap-4">
      <div class="flex-auto">
        <p>分辨率</p>
        <el-select>
          <el-option></el-option>
        </el-select>
      </div>
      <div class="flex-auto">
        <p>帧数</p>
        <el-select>
          <el-option></el-option>
        </el-select>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
p {
  @apply mb-2 text-xs text-gray-500
}
</style>

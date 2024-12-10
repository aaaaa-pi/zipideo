<script setup lang="ts">
import { InboxOut } from '@icon-park/vue-next'
import useVideo from '@renderer/composables/useVideo'

const { addFile } = useVideo()
</script>

<template>
  <main>
    <section class="flex justify-center items-center gap-4">
      <div class="button mx-2">
        <el-upload
          class="w-full h-full"
          action="#"
          :http-request="addFile"
          multiple
          :show-file-list="false"
          drag
          accept="video/*"
        >
          <div class="flex flex-col items-center justify-center w-full h-full">
            <inbox-out theme="filled" size="36" fill="#0a65cc" class="inline-block" />
            <p class="text-slate-500 text-sm">点击或拖拽上传文件</p>
          </div>
        </el-upload>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.button {
  @apply h-20 rounded-lg bg-white flex justify-center items-center text-slate-600 flex-auto;
}

:deep(.el-upload) {
  @apply w-full h-full;
}

:deep(.el-upload-dragger) {
  @apply w-full h-full flex flex-col justify-center items-center;
  border: none;
  padding: 0;
}
</style>

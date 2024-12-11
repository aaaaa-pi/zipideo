<script setup lang="ts">
import { InboxOut } from '@icon-park/vue-next'
import useVideo from '@renderer/composables/useVideo'
import { useConfigStore } from '@renderer/stores/useConfigStore'
import { ElMessage, UploadRequestOptions } from 'element-plus'

const { addFile } = useVideo()
const { config } = useConfigStore()

// 包装addFile函数，添加状态检查
const handleUpload = (options: UploadRequestOptions) => {
  if (config.isProcessing && config.processingType === 'ai') {
    ElMessage.warning({ message: '请等待AI处理完成后再进行处理', grouping: true })
    return
  }
  addFile(options)
}
</script>

<template>
  <main>
    <section class="flex justify-center items-center gap-4">
      <div class="button mx-2" :class="{ 'disabled': config.isProcessing && config.processingType === 'ai' }">
        <el-upload
          class="w-full h-full"
          action="#"
          :http-request="handleUpload"
          multiple
          :show-file-list="false"
          drag
          accept="video/*"
          :disabled="config.isProcessing && config.processingType === 'ai'"
        >
          <div class="flex flex-col items-center justify-center w-full h-full">
            <inbox-out
              theme="filled"
              size="36"
              :fill="config.isProcessing && config.processingType === 'ai' ? '#9CA3AF' : '#0a65cc'"
              class="inline-block"
            />
            <p class="text-sm" :class="config.isProcessing && config.processingType === 'ai' ? 'text-gray-400' : 'text-slate-500'">
              {{ config.isProcessing && config.processingType === 'ai' ? '请等待AI处理完成' : '点击或拖拽上传文件' }}
            </p>
          </div>
        </el-upload>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.button {
  @apply h-20 rounded-lg bg-white flex justify-center items-center text-slate-600 flex-auto;

  &.disabled {
    @apply bg-gray-100 opacity-60 cursor-not-allowed;
  }
}

:deep(.el-upload) {
  @apply w-full h-full;
}

:deep(.el-upload-dragger) {
  @apply w-full h-full flex flex-col justify-center items-center;
  border: none;
  padding: 0;

  &.is-disabled {
    @apply bg-gray-100 cursor-not-allowed;
  }
}
</style>

<script setup lang="ts">
import { VideoType, VideoState } from '@renderer/types'
import { CloseOne } from '@icon-park/vue-next'
import useVideo from '@renderer/composables/useVideo'
const { removeFile, bgColor } = useVideo()

interface Props {
  video: VideoType
  index: number
}

const { video, index } = defineProps<Props>()
</script>

<template>
  <section
    class="videoItem"
    :style="`--process:${Math.round(video.progress)}%;--bgColor:${bgColor(video)}`"
  >
    <div class="progressBgColor"></div>
    <div class="flex items-center gap-1">
      <div v-if="video.state === VideoState.COMPRESS" class="progress">
        {{ `${Math.round(video.progress)}%` }}
      </div>
      <div class="title z-10">{{ video.name }}</div>
    </div>
    <div class="icon">
      <close-one theme="outline" size="12" @click="removeFile(index)" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
.videoItem {
  @apply relative bg-slate-100 px-3 py-1 rounded-lg mb-2 mx-3 text-xs text-slate-600 flex justify-between items-center;
  .progress {
    @apply w-[20px] h-[20px] bg-white relative rounded-full text-[10px] flex justify-center items-center text-slate-800 opacity-90 px-4;
  }
  .progressBgColor {
    @apply absolute top-0 left-0 right-0 bottom-0 z-0 rounded-lg;
    width: var(--process);
    background-color: var(--bgColor);
  }
  .icon {
    @apply text-slate-500 opacity-50 hover:scale-125 duration-300 hover:text-red-500 hover:opacity-90 cursor-pointer;
  }
}
</style>

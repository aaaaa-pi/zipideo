<script setup lang="ts">
import Actions from '@renderer/components/Actions.vue'
import Frame from '@renderer/components/Frame.vue'
import Button from '@renderer/components/Button.vue'
import VideoList from '@renderer/components/VideoList.vue'

// const videoOptions = {
//   file: '../test',
//   fps: 30,
//   size: '1920x720'
// }
// const compressVideo = () => {
//   window.api.compress(videoOptions)
// }
</script>

<template>
  <main>
    <Frame class="mt-3" />
    <Actions class="mt-5" />
    <Button class="mt-3" />
    <VideoList class="mt-5" />
  </main>
</template>

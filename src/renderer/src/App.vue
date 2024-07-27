<script setup lang="ts">
import Navbar from './components/Navbar.vue'
import Actions from './components/Actions.vue'
import Frame from './components/Frame.vue'
import Button from './components/Button.vue'
import VideoList from './components/VideoList.vue'
</script>

<template>
  <main>
    <Navbar />
    <Frame class="mt-3" />
    <Actions class="mt-5" />
    <Button class="mt-3" />
    <VideoList class="mt-5" />
  </main>
</template>

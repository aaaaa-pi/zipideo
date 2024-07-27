<script setup lang="ts">
import { InboxOut, UpdateRotation } from '@icon-park/vue-next'
</script>

<template>
  <main>
    <section class="flex justify-center items-center gap-4">
      <div class="button ml-2">
        <inbox-out theme="filled" size="36" fill="#0a65cc" />
      </div>
      <div class="button mr-2">
        <update-rotation theme="outline" size="36" fill="#0a65cc" />
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.button {
  @apply h-20 rounded-lg bg-white flex justify-center items-center text-slate-600 flex-auto;
}
</style>

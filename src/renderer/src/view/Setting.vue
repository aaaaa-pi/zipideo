<script setup lang="ts">
import Card from '@renderer/components/Card.vue'
import FrameSizeSet from '@renderer/components/FrameSizeSet.vue'
</script>

<template>
  <main>
    <Card title="分辨率">
      <FrameSizeSet type="size" placeholder="设置的分辨率" tip="请输入'1024x720'格式的值" />
    </Card>
    <Card title="帧数">
      <FrameSizeSet type="frame" placeholder="设置的帧数" tip="请输入'60'格式的值" />
    </Card>
  </main>
</template>

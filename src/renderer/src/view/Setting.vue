<script setup lang="ts">
import Card from '@renderer/components/Card.vue'
import FrameSizeSet from '@renderer/components/FrameSizeSet.vue'
import SaveFile from '@renderer/components/SaveFile.vue'
import About from '@renderer/components/About.vue'
import FileNameSet from '@renderer/components/FileNameSet.vue'
</script>

<template>
  <main>
    <Card title="分辨率">
      <FrameSizeSet type="size" placeholder="分辨率列表" tip="请输入'1024x720'格式的值" />
    </Card>
    <Card title="帧数">
      <FrameSizeSet type="frame" placeholder="帧数列表" tip="请输入'60'格式的值" />
    </Card>
    <Card title="视频保存目录">
      <SaveFile />
    </Card>
    <Card title="文件命名格式">
      <FileNameSet />
    </Card>
    <Card title="关于zipvideo">
      <About />
    </Card>
  </main>
</template>

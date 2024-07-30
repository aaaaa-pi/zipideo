<script setup lang="ts">
import { DataType } from '@renderer/types'
interface Props {
  type: DataType
  placeholder?: string
  tip?: string
}

const props = defineProps<Props>()
</script>

<template>
  <main>
    <el-select :placeholder="props.placeholder">
      <el-option></el-option>
    </el-select>
    <div class="flex gap-1 mt-2 items-center">
      <el-input :placeholder="props.tip" size="default" clearable></el-input>
      <el-button color="#0a65cc" size="default">增加</el-button>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/useConfigStore'

const { config } = useConfigStore()

// 当配置变化时更新OpenAI实例
const updateConfig = () => {
  window.api.updateOpenAIConfig({
    apiKey: config.openaiConfig.apiKey,
    baseUrl: config.openaiConfig.baseUrl,
    model: config.openaiConfig.model
  })
}

// 组件挂载时初始化配置
updateConfig()
</script>

<template>
  <section class="flex flex-col gap-3">
    <div>
      <p class="mb-2 text-xs text-gray-500">API Key</p>
      <el-input type="password" v-model="config.openaiConfig.apiKey" placeholder="请输入 API Key" @change="updateConfig" />
    </div>
    <div>
      <p class="mb-2 text-xs text-gray-500">API Base URL</p>
      <el-input v-model="config.openaiConfig.baseUrl" placeholder="请输入 API Base URL（可选）" @change="updateConfig" />
    </div>
    <div>
      <p class="mb-2 text-xs text-gray-500">AI Model</p>
      <el-input v-model="config.openaiConfig.model" placeholder="例如：gpt-3.5-turbo, qwen-turbo, glm-4, gemini-pro" @change="updateConfig" />
    </div>
  </section>
</template>



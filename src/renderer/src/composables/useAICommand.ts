import { ref } from 'vue'

export default function useAICommand() {
  const prompt = ref('')
  const command = ref('')
  const description = ref('')
  const isGenerating = ref(false)

  const handleGenerateCommand = async (fileName: string) => {
    isGenerating.value = true
    try {
      const response = await window.api.generateFFmpegCommand(prompt.value, fileName)

      if (response.success && response.data) {
        command.value = response.data.command
        description.value = response.data.description
      } else {
        throw new Error(response.error || '生成命令失败')
      }
    } finally {
      isGenerating.value = false
    }
  }

  return {
    prompt,
    command,
    description,
    isGenerating,
    handleGenerateCommand
  }
}

import { useConfigStore } from '@renderer/stores/useConfigStore'

export default () => {
  const { config } = useConfigStore()
  const compress = () => {
    window.api.compress({
      file: { ...config.files[0] },
      fps: Number(config.frame),
      size: config.size
    })
  }

  return { compress }
}

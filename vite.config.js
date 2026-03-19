module.exports = async () => {
  const { defineConfig } = require('vite')
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  return defineConfig({
    plugins: [reactPlugin()]
  })
}

module.exports = async () => {
  const { defineConfig } = require('vite')
  const reactPlugin = (await import('@vitejs/plugin-react')).default
  return defineConfig({
    plugins: [reactPlugin()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/test/setup.js'
    }
  })
}

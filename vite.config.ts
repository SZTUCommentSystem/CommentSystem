import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock' // 引入mock插件提供的方法

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [
      vue(),
      //mock配置项
      viteMockServe({
        mockPath: 'mock',
        localEnabled: command === 'serve'
      })
    ],
    resolve: {
      alias: {
        // '@': fileURLToPath(new URL('./src', import.meta.url))
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      proxy: {
        '/api': {
          // target: 'http://localhost:8080',
          target: 'http://47.103.49.29:9024/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
            });
          }
        }
      },
      // headers: {
      //   'Cache-Control': 'no-store' // 禁用缓存
      // }
    }
  }
})

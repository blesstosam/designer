import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvg } from './src/assets/icons/index-vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
// import legacy from '@vitejs/plugin-legacy'
import qiankun from 'vite-plugin-qiankun'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3002
  },
  base: process.env.NODE_ENV === 'production' ? 'http://localhost:8080' : '/',
  plugins: [
    vue(),
    qiankun('designer', {
      useDevMode: true
    }),
    // legacy({
    //   // targets: {
    //   //   esmodules: false,
    //   // }
    //   targets: ["ie >= 11"],
    // }),
    monacoEditorPlugin(),
    createSvg('./src/assets/icons/svg/')
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, './src')
    }
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        }
      ]
    }
  }
})

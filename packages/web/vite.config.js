import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvg } from './src/assets/icons/index-vite'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'
// import legacy from '@vitejs/plugin-legacy'
import qiankun from 'vite-plugin-qiankun'


// https://vitejs.dev/config/
export default ({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return defineConfig({
    server: {
      port: 3002
    },
    base: mode === 'production' ? env.BASE_URL : '/',
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
}

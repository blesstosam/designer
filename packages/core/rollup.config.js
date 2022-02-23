import { terser } from 'rollup-plugin-terser'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
const { name, version } = require('./package.json')

const NODE_ENV = process.env.NODE_ENV
const isProd = NODE_ENV === 'production'

const plugs = [
  resolve({
    customResolveOptions: {
      moduleDirectories: ['node_modules']
    }
  }),
  commonjs(),
  babel({ babelHelpers: 'bundled' })
  // 必须加上 exclude 否则报错 https://github.com/rollup/plugins/issues/381
  // babel({ babelHelpers: 'runtime', exclude: 'node_modules/**' }),
]

const banner = `/*!\n * ${name} v${version}\n * @author blesstosam\n */`

const cfg = {
  input: 'src/index.js',
  output: [
    {
      file: isProd ? 'lib/loader.common.prod.js' : 'lib/loader.common.js',
      name: 'QPaasLoader',
      format: 'umd',
      globals: {
        vue: 'Vue'
      },
      banner
    },
    {
      file: isProd ? 'lib/loader.prod.js' : 'lib/loader.js',
      name: 'QPaasLoader',
      format: 'esm',
      banner
    }
  ],
  external: ['vue'],
  plugins: isProd ? [...plugs, terser()] : plugs
}

export default cfg

<template>
  <div>
    <div v-if="loading">
      <slot name="loading"><div style="color: #ccc">loading...</div></slot>
    </div>
    <div v-else-if="error">
      <slot name="error">{{ error }}</slot>
    </div>
    <div ref="content"></div>
  </div>
</template>

<script>
import { isPlainObject } from '../util'
import { loader } from './loader'

const DELAY_LOADING_TIME = 200

export default {
  name: 'Custom',
  props: {
    moduleData: {
      type: Object,
      validator(obj) {
        return isPlainObject(obj)
      }
    },
    ctx: {
      type: Object,
      default: () => {},
      validator(obj) {
        return isPlainObject(obj)
      }
    }
  },
  data() {
    return {
      loading: false,
      delaying: true,
      error: null
    }
  },
  mounted() {
    this.load()
      .then(mod => {
        const instance = mod.mount(document.createElement('div'), this.ctx)
        this.$nextTick(() => {
          this.$refs.content.append(instance.el)
        })
      })
      .catch(err => {
        this.loading = false
        this.timer && window.clearTimeout(this.timer)
        this.error = err
      })
  },
  methods: {
    load() {
      this.timer = setTimeout(() => {
        this.loading = true
        this.delaying = false
      }, DELAY_LOADING_TIME)

      return new Promise((resolve, reject) => {
        const cb = mod => {
          this.loading = false
          this.timer && window.clearTimeout(this.timer)
          if (mod && mod.mount) {
            resolve(mod)
          } else {
            this.error = { msg: 'mod or mod.mount not found!' }
            reject(this.error)
          }
        }
        const errorCb = err => {
          this.loading = false
          this.timer && window.clearTimeout(this.timer)
          this.error = err
          reject(err)
        }

        loader.fetch(this.moduleData.js, cb, errorCb)
      })
    }
  }
}
</script>
<style scoped>
.top {
  display: flex;
  margin-bottom: 8px;
}
.top > div {
  margin-right: 8px;
}
.top .el-button {
  padding: 0;
  width: 30px;
  flex: none;
}
.center {
  background-color: #e9e9e9;
  padding: 8px 0 0 0;
  display: flex;
  flex-wrap: wrap;
}
.item {
  width: 46%;
  margin-bottom: 8px;
  padding-left: 4px;
  padding-right: 4px;
  display: flex;
}
.item .el-button {
  margin-left: 2px;
  padding: 0;
  width: 30px;
  flex: none;
}
.item svg {
  flex: none;
  margin-top: 6px;
  margin-right: 4px;
}
</style>

<template>
  <div>
    <div class="top">
      <el-input-number size="small" controls-position="right" v-model="val" @input="handleTotalChange"></el-input-number>
      <el-button size="small" @click="changeUnit">{{ unit }}</el-button>
    </div>

    <div class="center">
      <div class="item" v-for="index in 4" :key="index">
        <svg
          t="1626866835315"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="12344"
          width="18"
          height="18"
          v-if="index === 1"
        >
          <path
            d="M853.333333 170.666667a42.666667 42.666667 0 0 0 0-85.333334H170.666667a42.666667 42.666667 0 0 0 0 85.333334h682.666666z m-341.333333 768a42.666667 42.666667 0 0 0 42.666667-42.666667V416.298667l168.533333 168.533333a42.666667 42.666667 0 1 0 60.330667-60.330667l-241.365334-241.365333a42.666667 42.666667 0 0 0-60.330666 0l-241.365334 241.365333a42.666667 42.666667 0 0 0 60.330667 60.330667L469.333333 416.298667V896a42.666667 42.666667 0 0 0 42.666667 42.666667z"
            fill="#333"
            p-id="12345"
          ></path>
        </svg>

        <svg
          t="1626876762578"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="78620"
          width="18"
          height="18"
          v-if="index === 2"
        >
          <path
            d="M806.2 834.3c-8.3 0-15-6.7-15-15V206.1c0-8.3 6.7-15 15-15s15 6.7 15 15v613.2c0 8.3-6.7 15-15 15z"
            p-id="78621"
            fill="#2c2c2c"
          ></path>
          <path
            d="M545.7 700c-3.5 0-7.1-1.2-9.9-3.8-6.2-5.5-6.8-15-1.3-21.2l130.1-147.3h-445c-8.3 0-15-6.7-15-15s6.7-15 15-15h478.3c5.9 0 11.2 3.5 13.7 8.8 2.4 5.4 1.5 11.7-2.4 16.1L557 695c-3 3.3-7.1 5-11.3 5z"
            fill="#2c2c2c"
            p-id="78622"
          ></path>
          <path
            d="M697.9 524.5c-4.1 0-8.2-1.7-11.2-5L534.5 348.6c-5.5-6.2-5-15.7 1.2-21.2s15.7-5 21.2 1.2L709 499.5c5.5 6.2 5 15.7-1.2 21.2-2.8 2.5-6.4 3.8-9.9 3.8z"
            fill="#2c2c2c"
            p-id="78623"
          ></path>
        </svg>

        <svg
          t="1626866872947"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="15735"
          width="18"
          height="18"
          v-if="index === 4"
        >
          <path
            d="M853.333333 853.333333a42.666667 42.666667 0 0 1 0 85.333334H170.666667a42.666667 42.666667 0 0 1 0-85.333334h682.666666zM512 85.333333a42.666667 42.666667 0 0 1 42.666667 42.666667v479.701333l168.533333-168.533333a42.666667 42.666667 0 1 1 60.330667 60.330667l-241.365334 241.365333a42.666667 42.666667 0 0 1-60.330666 0l-241.365334-241.365333a42.666667 42.666667 0 0 1 60.330667-60.330667l168.533333 168.533333V128a42.666667 42.666667 0 0 1 42.666667-42.666667z"
            fill="#333"
            p-id="15736"
          ></path>
        </svg>

        <svg
          t="1626877086299"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="80815"
          width="18"
          height="18"
          v-if="index === 3"
        >
          <path
            d="M368.512 469.376h591.530667a21.333333 21.333333 0 0 1 21.333333 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333333 21.333333H368.554667l183.594666 183.594667a21.333333 21.333333 0 0 1 0 30.165333l-30.165333 30.165334a21.333333 21.333333 0 0 1-30.165333 0l-271.530667-271.530667a21.333333 21.333333 0 0 1 0-30.165333l271.530667-271.530667a21.333333 21.333333 0 0 1 30.165333 0l30.165333 30.165333a21.333333 21.333333 0 0 1 0 30.165334L368.512 469.333333z m-325.802667 277.333333v-469.333333a21.333333 21.333333 0 0 1 21.333334-21.333333h42.666666a21.333333 21.333333 0 0 1 21.333334 21.333333v469.333333a21.333333 21.333333 0 0 1-21.333334 21.333334h-42.666666a21.290667 21.290667 0 0 1-21.333334-21.333334z"
            p-id="80816"
          ></path>
        </svg>
        <el-input-number
          controls-position="right"
          size="small"
          width="60px"
          v-model="valArr[index - 1]"
          @input="handleItemChange"
        ></el-input-number>
        <el-button @click="changeUnit(index)" size="small">{{ unitArr[index - 1] }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Margin',
  props: {
    modelValue: String
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      val: 0, // val: 1 => valArr: [1,1,1,1]
      valArr: [0,0,0,0],
      unit: 'px', // px|em|%
      unitArr: ['px', 'px', 'px', 'px']
    }
  },
  created() {
    console.log(this.modelValue, 'this.modelValue')
    if (typeof this.modelValue === 'string' && this.modelValue) {
      this.valArr = this.modelValue.split(' ').map(i => Number(i.replace(/(em|px|%)$/, '')))
      this.val = ''
    }
  },
  computed: {
    finalVal() {
      return this.valArr.map((i, idx) => `${i}${this.unitArr[idx]}`).join(' ')
    }
  },
  methods: {
    handleItemChange(val) {
      console.log(this.valArr, 111)
      this.$emit('update:modelValue', this.finalVal)
      this.$emit('change', this.finalVal)
    },
    handleTotalChange(val) {
      this.valArr = new Array(4).fill(val)
      this.$emit('update:modelValue', this.finalVal)
      this.$emit('change', this.finalVal)
    },
    changeUnit(index) {
      const map = {
        px: 'em',
        em: '%',
        '%': 'px'
      }
      if (typeof index === 'number') {
        this.unitArr[index - 1] = map[this.unitArr[index - 1]]
      } else {
        this.unit = map[this.unit]
        this.unitArr = new Array(4).fill(this.unit)
      }
    }
  }
}
</script>

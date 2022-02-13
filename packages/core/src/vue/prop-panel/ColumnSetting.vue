<style scoped>
.column-setting div {
  box-sizing: border-box;
}
.column-setting .row {
  display: flex;
  flex-wrap: nowrap;
}
.row-1,
.row-2 {
  margin-bottom: 8px;
}
.column-setting .row .item {
  width: 100px;
  margin-right: 12px;
  height: 75px;
  border: 1px solid #d9d9d9;
  flex: 1 1 33.33%;
  padding: 4px;
  box-sizing: border-box;
}
.column-setting .row .item:nth-child(3) {
  margin-right: 0;
}
.column-setting .row .item .inner {
  background: rgba(187, 197, 213, 0.5);
  height: 100%;
}

.item-2 {
  display: flex;
}
.item-2 .inner {
  flex: 1;
}
.item-2 .inner:nth-child(1) {
  margin-right: 6px;
}

.item-3 {
  display: flex;
}
.item-3 .inner {
  flex: 1;
}
.item-3 .inner:nth-child(1) {
  margin-right: 6px;
}
.item-3 .inner:nth-child(2) {
  margin-right: 6px;
}

.item-4 {
  display: flex;
}
.item-4 .inner {
  flex: 1;
}
.item-4 .inner:nth-child(1) {
  margin-right: 6px;
}
.item-4 .inner:nth-child(2) {
  margin-right: 6px;
}
.item-4 .inner:nth-child(3) {
  margin-right: 6px;
}

.item-5 {
  display: flex;
}
.item-5 .inner:nth-child(1) {
  width: 25%;
  margin-right: 6px;
}
.item-5 .inner:nth-child(2) {
  width: 75%;
}

.item-6 {
  display: flex;
}
.item-6 .inner:nth-child(2) {
  width: 25%;
}
.item-6 .inner:nth-child(1) {
  width: 75%;
  margin-right: 6px;
}

.item-7 {
  display: flex;
}
.item-7 .inner:nth-child(1) {
  width: 25%;
  margin-right: 6px;
}
.item-7 .inner:nth-child(2) {
  width: 50%;
  margin-right: 6px;
}
.item-7 .inner:nth-child(3) {
  width: 25%;
}

.item-8 {
  display: flex;
}
.item-8 .inner:nth-child(1) {
  width: 25%;
  margin-right: 6px;
}
.item-8 .inner:nth-child(2) {
  width: 25%;
  margin-right: 6px;
}
.item-8 .inner:nth-child(3) {
  width: 50%;
}

.item-9 {
  text-align: center;
  padding-top: 12px;
}
.item-9 svg {
  margin-top: 8px;
}

.ratio-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.actived {
  border: 1px solid #108ee9 !important;
}
</style>
<template>
  <div class="column-setting">
    <div class="row row-1">
      <div class="item item-1" @click="handleChange(1)" :class="{ actived: selected === 1 }">
        <div class="inner"></div>
      </div>
      <div class="item item-2" @click="handleChange(2)" :class="{ actived: selected === 2 }">
        <div class="inner"></div>
        <div class="inner"></div>
      </div>
      <div class="item item-3" @click="handleChange(3)" :class="{ actived: selected === 3 }">
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="inner"></div>
      </div>
    </div>

    <div class="row row-2">
      <div class="item item-4" @click="handleChange(4)" :class="{ actived: selected === 4 }">
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="inner"></div>
      </div>
      <div class="item item-5" @click="handleChange(5)" :class="{ actived: selected === 5 }">
        <div class="inner"></div>
        <div class="inner"></div>
      </div>
      <div class="item item-6" @click="handleChange(6)" :class="{ actived: selected === 6 }">
        <div class="inner"></div>
        <div class="inner"></div>
      </div>
    </div>

    <div class="row row-3">
      <div class="item item-7" @click="handleChange(7)" :class="{ actived: selected === 7 }">
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="inner"></div>
      </div>
      <div class="item item-8" @click="handleChange(8)" :class="{ actived: selected === 8 }">
        <div class="inner"></div>
        <div class="inner"></div>
        <div class="inner"></div>
      </div>
      <div class="item item-9" @click="handleChange(9)" :class="{ actived: selected === 9 }">
        <svg
          t="1624777177290"
          class="icon"
          viewBox="0 0 1105 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2523"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="50"
          height="46"
        >
          <path
            d="M418.52293011 1025.10188073c-2.87315555 0-5.87123024-0.37475882-8.7443844-1.24919837-86.06972787-23.85967838-165.51870649-69.58031637-229.8523925-132.41496574-6.74566841-6.62074787-10.24342243-15.86481162-9.7437431-25.23379589 0.49967935-9.36898289 5.12171122-18.23828782 12.61689726-23.98459753 41.09860751-31.9794629 52.4663064-89.81732021 26.48299288-134.66352141-26.10823405-44.97112035-81.82245482-63.95892719-129.9165704-44.72128069-8.74438439 3.62267318-18.73796716 3.24791436-27.10759138-1.12427783-8.36962558-4.24727306-14.61561463-11.99229877-16.8641703-21.11144199-10.99294006-43.34716318-16.4894101-87.8186042-16.4894101-132.29004522 0-44.34652187 5.49647004-88.81796288 16.4894101-132.29004521 2.3734762-9.11914322 8.49454473-16.8641703 16.8641703-21.23636251 8.36962558-4.3721922 18.23828782-4.74695102 27.10759138-1.12427783 47.96919504 19.48748479 103.68341583 0.37475882 129.79164987-44.59636154 25.98331353-44.72128069 14.61561463-102.6840585-26.48299288-134.66352143-7.49518605-5.87123024-11.99229877-14.61561463-12.61689725-23.98459752-0.49967935-9.36898289 2.99807469-18.61304663 9.74374309-25.23379588 64.33368603-62.83464799 143.90758516-108.68020788 229.85239249-132.41496575 9.24406374-2.3734762 18.8628863-0.87443817 26.73283255 4.24727306 7.86994623 5.24663037 13.1165766 13.49133541 14.36577496 22.86031969 6.99550807 51.34202857 51.46694909 90.06715987 103.30865699 90.06715987 37.10117412 0 89.94224073-55.21454279 103.68341582-79.44897862-0.99935869-4.99679069-0.74951902-10.36834158 0.74951902-15.61497193 5.24663037-17.23892912 23.4849182-26.85775307 40.59892816-21.98588155 0 0 0 0 0.12491916 0l0 0 0 0c89.69240105 26.73283254 166.76790484 71.32919409 229.10287347 132.16512608 6.74566841 6.62074787 10.36834158 15.86481162 9.86866224 25.23379589-0.49967935 9.36898289-5.12171122 18.11336729-12.61689725 23.98459753-40.97368699 31.9794629-52.4663064 89.81732021-26.48299288 134.66352141 26.10823405 44.97112035 81.94737534 64.20876687 129.9165704 44.59636155 8.74438439-3.62267318 18.61304663-3.24791436 27.10759137 1.12427782 8.49454473 4.24727306 14.61561463 11.99229877 16.86417029 21.23636252 10.99294006 43.47208231 16.4894101 87.94352473 16.48941011 132.16512606s-5.62139056 88.69304236-16.48941011 132.29004522c-2.3734762 9.11914322-8.49454473 16.8641703-16.86417029 21.11144197-8.49454473 4.3721922-18.23828782 4.74695102-27.10759137 1.12427785-47.96919504-19.36256565-103.80833635-0.24983967-129.9165704 44.72128069-25.98331353 44.72128069-14.61561463 102.6840585 26.48299288 134.66352141 7.49518605 5.74630971 11.99229877 14.49069411 12.61689725 23.98459752s-2.99807469 18.61304663-9.86866224 25.23379589c-64.20876687 62.70972883-143.65774548 108.55528736-229.85239249 132.41496574-9.11914322 2.49839535-18.8628863 0.99935869-26.60791342-4.24727304-7.86994623-5.24663037-13.1165766-13.61625595-14.4906941-22.8603197-6.99550807-51.34202857-51.34202857-90.06715987-103.30865699-90.06715987-51.8417079 0-96.31314892 38.72513131-103.30865699 90.06715987-1.24919837 9.36898289-6.49582873 17.61368932-14.36577497 22.8603197C431.13982874 1023.35300301 424.89383969 1025.10188073 418.52293011 1025.10188073zM250.38090774 867.20328079c43.09732351 36.3516551 92.44063606 64.83336537 145.28170267 83.69625168 24.48427687-64.45860516 87.19400571-109.55464606 158.64811894-109.55464605 71.45411324 0 134.16384207 45.09603952 158.64811894 109.55464605 52.96598574-18.8628863 102.18437916-47.34459655 145.28170268-83.69625168-43.59700285-53.71550476-51.34202857-130.54116889-15.49005282-192.37645954 35.72705661-61.71037014 106.18181116-93.06523456 174.13817174-82.69689299 4.99679069-27.73219123 7.37026689-55.83914128 7.3702669-83.69625167 0-27.85711039-2.49839535-55.83914128-7.3702669-83.69625166-67.70651953 10.99294006-138.28619458-20.98652283-174.13817174-82.69689298-35.85197714-61.71037014-28.10695005-138.53603427 15.49005282-192.25153904-42.09796481-35.47721694-91.06651856-63.45924785-146.03122169-83.57133251-27.85711039 45.72063937-95.18887109 109.30480638-157.89859993 109.30480638-71.32919409 0-134.03892291-45.09603952-158.64811894-109.55464606-52.8410666 18.73796716-102.18437916 47.21967602-145.28170267 83.82117081 43.59700285 53.71550476 51.34202857 130.54116889 15.4900528 192.25153903-35.85197714 61.71037014-105.80705233 93.43999475-174.0132512 82.69689298-4.99679069 27.73219123-7.49518605 55.71422076-7.49518604 83.69625167 0 27.98203091 2.49839535 55.96406044 7.49518604 83.69625167 67.83144005-10.74310039 138.28619458 20.98652283 174.13817174 82.82181351C301.59801716 736.53719138 293.9779106 813.48777605 250.38090774 867.20328079z"
            fill="#b8b8b8"
            p-id="2524"
          ></path>
          <path
            d="M554.18581022 678.32457528c-93.56491391 0-169.76597953-76.20106563-169.76597955-169.89089869s76.20106563-169.76597953 169.76597955-169.76597953c93.56491391 0 169.76597953 76.20106563 169.76597952 169.76597953S647.75072412 678.32457528 554.18581022 678.32457528zM554.18581022 404.1256609c-57.58801762 0-104.43293485 46.84491723-104.43293485 104.43293485s46.84491723 104.43293485 104.43293485 104.43293481c57.58801762 0 104.30801568-46.84491723 104.30801568-104.43293481S611.77382782 404.1256609 554.18581022 404.1256609z"
            fill="#b8b8b8"
            p-id="2525"
          ></path>
        </svg>
      </div>
    </div>
    <div class="ratio-wrap" v-if="selected === 9">
      <span>自定义比例</span>
      <el-tooltip class="item" effect="dark" content="输入值和应为24，用冒号分隔" placement="top">
        <el-input
          v-model="defaultVal"
          style="width: 193px"
          size="medium"
          @blur="handleBlur"
        ></el-input>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
const RATIO_ARR = ['24', '12:12', '8:8:8', '6:6:6:6', '6:18', '18:6', '6:12:6', '6:6:12']
const TOTAL_COL = 24

export default {
  name: 'ColumnSetting',
  data() {
    return {
      defaultVal: '',
      selected: 2
    }
  },
  created() {
    this.defaultVal = this.modelValue
    this.selected = RATIO_ARR.indexOf(this.defaultVal) + 1
  },
  emits: ['update:modelValue', 'change'],
  props: ['modelValue'],
  methods: {
    handleChange(index) {
      this.selected = index
      if (index !== 9) {
        this.defaultVal = RATIO_ARR[index - 1]
        this.$emit('change', this.defaultVal)
        this.$emit('update:modelValue', this.defaultVal)
      }
    },
    handleBlur(e) {
      const value = e.target.value
      const arr = value.split(':').map((i) => Number(i))
      const total = arr.reduce((r, c) => r + c, 0)
      if (total !== TOTAL_COL) {
        this.$message.warning('请输入正确的比例')
      } else {
        this.defaultVal = value
        this.$emit('change', this.defaultVal)
        this.$emit('update:modelValue', this.defaultVal)
      }
    }
  }
}
</script>

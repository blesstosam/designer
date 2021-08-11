<style scoped>
.logger-plugun-wrap {
  border-top: 1px solid #eee;
}
.logger-plugun-wrap .header {
  border-bottom: 1px solid #dedede;
  padding: 10px 8px;
  margin-bottom: 12px;
}
.logger-plugun-wrap .header span {
  margin-left: 6px;
  vertical-align: top;
}
.logger-plugun-wrap .wrap .item {
  padding: 8px 8px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  cursor: pointer;
}
.logger-plugun-wrap .item:hover {
  background-color: #f0f7ff;
}
.logger-plugun-wrap .time {
  font-family: ui-monospace;
}
</style>

<template>
  <div class="logger-plugun-wrap">
    <div class="header">
      <svg
        class="icon"
        viewBox="0 0 1075 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        fill="#333"
        width="18"
        height="18"
        @click="handleMenuClick('history')"
      >
        <path
          d="M557.6704 0c282.4704 0 511.488 229.0688 511.488 511.5392 0 282.5216-229.0176 511.488-511.488 511.488-282.5216 0-511.488-228.9664-511.488-511.488 0-282.4704 228.9664-511.488 511.488-511.488z m0 81.3568a430.1824 430.1824 0 1 0 0 860.3648 430.1824 430.1824 0 0 0 0-860.3648z"
          p-id="2025"
        ></path>
        <path
          d="M731.648 705.8432l-18.0736 18.0736a25.6 25.6 0 0 1-36.1472 0l-165.888-165.888c-5.7344-5.7344-5.0176-17.2544-5.0176-28.5696V204.6464a25.6 25.6 0 0 1 25.6-25.6h25.5488a25.6 25.6 0 0 1 25.6 25.6v316.5696l148.3776 148.48a25.6 25.6 0 0 1 0 36.1472z"
          p-id="2026"
        ></path>
      </svg>
      <span>日志</span>
    </div>

    <div class="wrap">
      <div v-if="logs.length">
        <div
          :class="{ active: index === activeIndex, item: 1 }"
          @click="activeIndex = index"
          v-for="(log, index) in logs"
          :key="index"
        >
          <div>{{ log.title }}</div>
          <div class="time">{{ log.timestamp }}</div>
        </div>
      </div>
      <div v-else style="color: #666; text-align: center">暂无日志</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoggerPlugin',
  props: ['logs'],
  data() {
    return {
      activeIndex: -1
    }
  },
  methods: {}
}
</script>

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
.logger-plugun-wrap .no-data {
  color: #909399;
  text-align: center;
  padding: 20px 0;
}
</style>

<template>
  <div class="logger-plugun-wrap">
    <div class="header">
      <record-icon fill="#333" :width="18" />
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
      <div v-else class="no-data">暂无日志</div>
    </div>
  </div>
</template>

<script>
import RecordIcon from '../vue/icons/RecordIcon.vue'
export default {
  name: 'LoggerPlugin',
  components: { RecordIcon },
  props: ['logs'],
  data() {
    return {
      activeIndex: -1
    }
  }
}
</script>

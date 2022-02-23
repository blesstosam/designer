<style scoped>
.logger-plugin-wrap {
  border-top: 1px solid #eee;
  height: 100%;
}
.logger-plugin-wrap .header {
  border-bottom: 1px solid #dedede;
  padding: 10px 8px;
  margin-bottom: 12px;
}
.logger-plugin-wrap .header span {
  margin-left: 6px;
  vertical-align: top;
}
.logger-plugin-wrap .wrap .item {
  padding: 6px 8px;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  cursor: pointer;
}
.logger-plugin-wrap .item:hover {
  background-color: #f0f7ff;
}
.logger-plugin-wrap .time {
  font-size: 12px;
  width: 57%;
  line-height: 20px;
}
.logger-plugin-wrap .title {
  width: 42%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.logger-plugin-wrap .no-data {
  color: #909399;
  text-align: center;
  padding: 20px 0;
}
.logger-plugin-wrap .wrap {
  height: calc(100vh - 115px);
  overflow-y: auto;
}
.logger-plugin-wrap .wrap::-webkit-scrollbar {
  width: 8px;
  height: 12px;
  background-color: transparent;
}
.logger-plugin-wrap .wrap::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 8px;
}
</style>

<template>
  <div class="logger-plugin-wrap">
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
          <el-tooltip effect="dark" :show-after="200" :content="log.title" placement="top">
            <div class="title">{{ log.title }}</div>
          </el-tooltip>
          <div class="time">{{ log.timestamp }}</div>
        </div>
      </div>
      <div v-else class="no-data">暂无日志</div>
    </div>
  </div>
</template>

<script>
import RecordIcon from '../../vue/icons/RecordIcon.vue'
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

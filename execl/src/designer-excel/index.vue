<style lang="stylus" scoped>
// @import '../assets/index.styl';

// .cannot-be-selected {
//   user-select: none;
// }

// .col {
//   cursor: pointer;
// }

// .col:hover {
//   .col-left, .col-right {
//     background-color: $background-color_cell_active;
//   }
// }
</style>

<template>
  <div class="table-container" ref="tableContainer">
    <div
      class="table"
      :class="{ 'no-borders': !border, 'no-stripe': !stripe }"
      :style="{ width: tableWidth }"
    >
      <div
        class="row"
        v-for="(row, rowIndex) in dataTable"
        :style="{ width: tableWidth, height: cellSize.height + 'px' }"
        :key="rowIndex"
      >
        <drop
          class="col cannot-be-selected"
          v-for="(col, colIndex) in dataTable[rowIndex]"
          :key="colIndex"
          v-show="handleAttribute(col.show, true)"
          :style="calculateStyle(col)"
          :class="dataChecked[col.id] && 'col-active'"
          @dragover="handleDragover(col, { rowIndex, colIndex }, ...arguments)"
          @dragleave="handleDragleave(col, { rowIndex, colIndex }, ...arguments)"
          @drop="handleDrop(col, { rowIndex, colIndex }, ...arguments)"
          @click.native="handleClickCell(col, ...arguments)"
          @contextmenu.native="handleContextmenu($event)"
          @mousedown.native="handleMousedown(col, ...arguments)"
          @mousemove.native="handleMousemove(col, ...arguments)"
          @mouseup.native="handleMouseup(col, ...arguments)"
        >
          <template v-if="col.preRenderData">
            <div class="col-left" :style="{ width: cellSize.width + 'px' }">
              {{ col.preRenderData.label }}
            </div>
            <div class="col-right">
              {{ col.preRenderData.component ? col.preRenderData.component.placeholder : '' }}
            </div>
          </template>
          <template v-else>
            <div class="col-left" :style="{ width: cellSize.width + 'px' }">{{ col.label }}</div>
            <div class="col-right">{{ col.component ? col.component.placeholder : '' }}</div>
          </template>
        </drop>
      </div>

      <!-- <context-menu
        v-model="showContextMenu"
        :position="positionContextMenu"
        :canMergeCell="canMergeCell"
        :canSplitCell="canSplitCell"
        @splitCell="handleSplitCell"
        @mergeCell="handleMergeCell"
        @delete="handleDelete"
      ></context-menu> -->
    </div>
  </div>
</template>

<script>
import { Drop } from 'vue-drag-drop';
// import ContextMenu from './ContextMenu.vue';
import * as TYPES from './types/table-types';
import BoxSelectModule from './BoxSelect';
import OperationModule from './Operation';
import MergeModule from './Merge';

export default {
  name: 'DraggableTable',
  created() {
    // this.initDataTable();
  },
  mounted() {
    document.addEventListener('keyup', this[TYPES.HANDLE_KEYUP]);
  },
  destroyed() {
    document.removeEventListener('keyup', this[TYPES.HANDLE_KEYUP]);
  },
  components: {
    Drop,
  },
  mixins: [new BoxSelectModule(), new OperationModule(), new MergeModule()],
  methods: {
    /**
     * @description: 初始化表格数据
     */
    initDataTable() {
      console.log(this[TYPES.GET_UNIQUEID], 11);
      // const { width, height } = this.tableSize;
      // let result = [];
      // for (let i = 0; i < height; i++) {
      //   let rows = [];
      //   for (let j = 0; j < width; j++) {
      //     const baseAttr = {
      //       position: { rowIndex: i, colIndex: j },
      //       rowspan: 1,
      //       colspan: 1,
      //     };
      //     rows.push({
      //       id: this[TYPES.GET_UNIQUEID]({ rowIndex: i, colIndex: j }),
      //       baseAttr,
      //       mergeInfo: {},
      //     });
      //   }
      //   result.push(rows);
      // }
      // console.log(result, '');
      // this.dataTable = result;
    },
  },
};
</script>

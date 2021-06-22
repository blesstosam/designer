/*
 * @Description: 事件模块(Base->Util->Event)
 */
import { cloneDeep as _cloneDeep, forEach as _forEach } from 'lodash';
import * as TYPES from './types/table-types';
import UtilModule from './Util';

export default class EventModule extends UtilModule {
  /**
   * @description: 元素内容变化
   */
  onCellChange() {
    this.$emit('cellChange', this[TYPES.GET_BOUNDARY]());
  }

  /**
   * @description: 单元格被点击
   * @param {TableForm.CellData} cellData
   */
  onClickCol(cellData) {
    this.$emit('click-col', cellData);
  }

  /**
   * @description: 表格尺寸发生变化
   * @param {TableForm.TableSize} tableSize
   */
  // TODO watch 怎么实现
  // @Watch('tableSize', { deep: true })
  // onTableSizeChange(tableSize) {
  //   const { width, height } = tableSize;
  //   let result = [];
  //   for (let i = 0; i < height; i++) {
  //     let rows = [];
  //     for (let j = 0; j < width; j++) {
  //       if (this.dataTable[i] && this.dataTable[i][j]) {
  //         rows.push(_cloneDeep(this.dataTable[i][j]));
  //       } else {
  //         const baseAttr = {
  //           position: { rowIndex: i, colIndex: j },
  //           rowspan: 1,
  //           colspan: 1,
  //         };
  //         rows.push({
  //           id: this[TYPES.GET_UNIQUEID]({ rowIndex: i, colIndex: j }),
  //           baseAttr,
  //           mergeInfo: {},
  //         });
  //       }
  //     }
  //     result.push(rows);
  //   }
  //   this.reset();
  //   this.dataTable = result;
  //   this.reHideCell();
  // }

  /**
   * @description: 重置各状态
   */
  reset() {
    this.dataChecked = {};
    this.checkedCellFirst = null;
    this.checkedCellLast = null;
    this.showContextMenu = false;
    this.multipleSelectInfo = null;
  }

  /**
   * @description: 重新执行隐藏需要隐藏的单元格--重绘合并单元格样式
   */
  reHideCell() {
    _forEach(this.needHideCellIdList, ({ rowIndex, colIndex }) => {
      if (this.dataTable[rowIndex][colIndex]) {
        this.dataTable[rowIndex][colIndex].show = false;
      }
    });
  }
}

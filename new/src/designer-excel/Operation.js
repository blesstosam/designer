/*
 * @Description: 操作模块(Base->Event->Data->Operation)
 */
import { cloneDeep as _cloneDeep } from 'lodash';
import * as TYPES from './types/table-types';
import DataModule from './Data';

export default class OperationModule extends DataModule {
  /**
   * @description: 监听按键事件
   * @param {KeyboardEvent} event
   */
  [TYPES.HANDLE_KEYUP](event) {
    const key = event.keyCode || event.which;
    /**
     * @description: DEL 按键
     */
    if (key === 46) {
      this[TYPES.HANDLE_DELETE]();
    }
  }

  /**
   * @description: 右击单元格
   * @param {MouseEvent} event
   */
  [TYPES.HANDLE_CONTEXTMENU](event) {
    event.preventDefault();
    this.positionContextMenu = { x: event.clientX, y: event.clientY };
    this.showContextMenu = true;

    this.canMergeCell = !!this.multipleSelectInfo;
    if (
      !this.multipleSelectInfo &&
      this.checkedCellFirst &&
      this.checkedCellFirst.mergeInfo.mergeFrom
    ) {
      this.canSplitCell = true;
    } else {
      this.canSplitCell = false;
    }
  }

  /**
   * @description: 鼠标拖动至元素上方时，添加预渲染数据
   * @param {TableForm.CellData} col
   * @param {TableForm.CellPosition} { rowIndex, colIndex }
   * @param {TableForm.TransferData} data
   * @param {DragEvent} event
   */
  [TYPES.HANDLE_DRAGOVER](col, { rowIndex, colIndex }, data, event) {
    if (!data || Array.isArray(data.data)) {
      return;
    }
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
    this.$set(this.dataTable[rowIndex][colIndex], 'preRenderData', data.data);
  }

  /**
   * @description: 清除预渲染数据
   * @param {TableForm.CellData} col
   * @param {TableForm.CellPosition} { rowIndex, colIndex }
   */
  [TYPES.HANDLE_DRAGLEAVE](col, { rowIndex, colIndex }) {
    if (col.preRenderData) {
      this.$set(this.dataTable[rowIndex][colIndex], 'preRenderData', null);
    }
  }
  /**
   * @description: 元素放下
   * @param {TableForm.CellData} col
   * @param {TableForm.CellPosition} { rowIndex, colIndex }
   * @param {TableForm.TransferData} data
   */
  [TYPES.HANDLE_DROP](col, { rowIndex, colIndex }, data) {
    console.log(data, '----data');
    if (!data) {
      return;
    }
    if (!Array.isArray(data.data) && data.groupName === this.groupName) {
      let newCol = _cloneDeep(data.data);
      newCol.id = col.id;
      newCol.baseAttr = col.baseAttr;
      newCol.mergeInfo = col.mergeInfo;
      console.log(newCol, '---newcol');
      this.$set(this.dataTable[rowIndex], colIndex, newCol);
      this[TYPES.ADD_CONTENT_RECORD](col.id, col.baseAttr.position);
      this[TYPES.CHECK_LABEL_REPEAT](col.baseAttr.position, newCol.label);
    } else if (Array.isArray(data.data)) {
      data.data.forEach((rowData) => {
        rowData.forEach((cellData) => {
          this[TYPES.SET_CELL_DATA](_cloneDeep(cellData));
        });
      });
    }
  }

  /**
   * @description: 删除元素内容
   */
  [TYPES.HANDLE_DELETE]() {
    if (this.multipleSelectInfo) {
      const { minRowIndex, minColIndex, maxRowIndex, maxColIndex } = this.multipleSelectInfo;
      const colspan = maxColIndex - minColIndex + 1;
      const rowspan = maxRowIndex - minRowIndex + 1;

      for (let c = 0; c < colspan; c++) {
        const curColIndex = minColIndex + c;
        for (let r = 0; r < rowspan; r++) {
          const curRowIndex = minRowIndex + r;
          /**
           * @description: 删除label列表项
           */
          this[TYPES.DEL_LABEL_ITEM]({ rowIndex: curRowIndex, colIndex: curColIndex });
          /**
           * @description: 删除拖拽数据记录
           */
          this[TYPES.DEL_CONTENT_RECORD]({ rowIndex: curRowIndex, colIndex: curColIndex });
        }
      }
      this.onCellChange();
    } else if (this.checkedCellFirst) {
      const { rowIndex, colIndex } = this.checkedCellFirst.baseAttr.position;
      /**
       * @description: 删除label列表项
       */
      this[TYPES.DEL_LABEL_ITEM](this.checkedCellFirst.label);
      /**
       * @description: 删除拖拽数据记录
       */
      this[TYPES.DEL_CONTENT_RECORD]({ rowIndex, colIndex });
      this.onCellChange();
    }
  }
}

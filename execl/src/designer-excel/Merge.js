/*
 * @Description: 合并单元格模块(Base->Event->Data->Merge)
 */
import { cloneDeep as _cloneDeep } from 'lodash';
import * as TYPES from './types/table-types';
import DataModule from './Data';

export default class MergeModule extends DataModule {
  /**
   * @description: 合并单元格
   */
  [TYPES.HANDLE_MERGE_CELL]() {
    if (this.multipleSelectInfo) {
      const { minRowIndex, minColIndex, maxRowIndex, maxColIndex } = this.multipleSelectInfo;
      const colspan = maxColIndex - minColIndex + 1;
      const rowspan = maxRowIndex - minRowIndex + 1;

      for (let c = 0; c < colspan; c++) {
        const curColIndex = minColIndex + c;
        /**
         * @description: 设置被合并到的单元格元素
         */
        for (let r = 0; r < rowspan; r++) {
          if (c !== 0 || r !== 0) {
            const curRowIndex = minRowIndex + r;
            const cell = this[TYPES.GET_CELL_DATA_BY_POSITION]({
              rowIndex: minRowIndex,
              colIndex: minColIndex,
            });
            if (cell) {
              this.dataTable[curRowIndex][curColIndex].mergeInfo.mergeTo = cell.baseAttr;
              /**
               * @description: 将状态设置成初始，防止合并已被合并的单元格会失败
               */
              this.dataTable[curRowIndex][curColIndex].show = true;
              this.dataTable[curRowIndex][curColIndex].baseAttr.rowspan = 1;
              this.dataTable[curRowIndex][curColIndex].baseAttr.colspan = 1;
              /**
               * @description: 删除被合并点的数据记录
               */
              this[TYPES.DEL_CONTENT_RECORD]({ rowIndex: curRowIndex, colIndex: curColIndex });
            }
          }
        }
        if (c !== 0) {
          /**
           * @description: 设置最小行的最小列到最大列隐藏
           */
          if (this.dataTable[minRowIndex] && this.dataTable[minRowIndex][curColIndex]) {
            this.dataTable[minRowIndex][curColIndex].show = false;
            const needHideCellData = this.dataTable[minRowIndex][curColIndex];
            this.needHideCellIdList[needHideCellData.id] = needHideCellData.baseAttr.position;
          }
        }
      }
      this.dataTable[minRowIndex][minColIndex].baseAttr.colspan = colspan;
      this.dataTable[minRowIndex][minColIndex].baseAttr.rowspan = rowspan;
      this.dataTable[minRowIndex][minColIndex].mergeInfo.mergeFrom = _cloneDeep(
        this.multipleSelectInfo
      );
      /**
       * @description: 重置框选信息
       */
      this.multipleSelectInfo = null;
      /**
       * @description: 将左上角点置为第一选点
       */
      this.checkedCellFirst = this.dataTable[minRowIndex][minColIndex];
      this.onCellChange();
    }
  }

  /**
   * @description: 拆分单元格
   */
  [TYPES.HANDLE_SPLIT_CELL]() {
    if (
      !this.multipleSelectInfo &&
      this.checkedCellFirst &&
      this.checkedCellFirst.mergeInfo.mergeFrom
    ) {
      this.multipleSelectInfo = _cloneDeep(this.checkedCellFirst.mergeInfo.mergeFrom);
      const {
        minRowIndex,
        minColIndex,
        maxRowIndex,
        maxColIndex,
      } = this.checkedCellFirst.mergeInfo.mergeFrom;
      const colspan = maxColIndex - minColIndex + 1;
      const rowspan = maxRowIndex - minRowIndex + 1;

      for (let c = 0; c < colspan; c++) {
        const curColIndex = minColIndex + c;
        /**
         * @description: 设置被合并到的单元格元素
         */
        for (let r = 0; r < rowspan; r++) {
          if (c !== 0 || r !== 0) {
            const curRowIndex = minRowIndex + r;
            const curCellData = this.dataTable[curRowIndex][curColIndex];
            if (curCellData) {
              curCellData.mergeInfo.mergeTo = undefined;
              this[TYPES.ADD_CHECKED](curCellData);
            }
          }
        }
        if (c !== 0) {
          /**
           * @description: 设置最小行的最小列到最大列隐藏
           */
          if (this.dataTable[minRowIndex] && this.dataTable[minRowIndex][curColIndex]) {
            this.dataTable[minRowIndex][curColIndex].show = true;
          }
          /**
           * @description: 防止该单元格无数据，所以单独获取id
           */
          const key = this[TYPES.GET_UNIQUEID]({
            rowIndex: minRowIndex,
            colIndex: curColIndex,
          });
          this.$delete(this.needHideCellIdList, key);
        }
      }
      this.dataTable[minRowIndex][minColIndex].baseAttr.colspan = 1;
      this.dataTable[minRowIndex][minColIndex].baseAttr.rowspan = 1;
      this.dataTable[minRowIndex][minColIndex].mergeInfo.mergeFrom = undefined;
      this.onCellChange();
    }
  }
}

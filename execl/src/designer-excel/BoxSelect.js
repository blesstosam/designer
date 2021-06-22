/*
 * @Description: 框选模块(Base->Event->Data->BoxSelect)
 */
import { forEach as _forEach } from 'lodash';
import * as TYPES from './types/table-types';
import DataModule from './Data';

export default class BoxSelectModule extends DataModule {
  /**
   * @description: 点击单元格
   * @param {TableForm.CellData} cellData
   * @param {MouseEvent} event
   */
  [TYPES.HANDLE_CLICK_CELL](cellData, event) {
    /**
     * @description: 按键框选
     */
    if (event && event.shiftKey) {
      this[TYPES.BOX_SELECT](cellData);
    } else {
      this[TYPES.SELECT_FIRST](cellData);
      this.onClickCol(cellData);
    }
  }

  /**
   * @description: 框选-基于第一个点和最后一个点（包含调用boxSelectByLimit）
   * @param { TableForm.CellData } celldata 末点
   */
  [TYPES.BOX_SELECT](cellData) {
    if (this.checkedCellFirst && this.checkedCellLast !== cellData) {
      this[TYPES.CLEAR_CHECKED]();
      this.checkedCellLast = cellData;
      const startVertexList = this[TYPES.GET_VERTEX_POSITION](this.checkedCellFirst.baseAttr);
      const endVertexList = this[TYPES.GET_VERTEX_POSITION](cellData.baseAttr);
      const multipleSelectInfo = this[TYPES.CHECK_VERTEX_POSITION_LIST](
        startVertexList.concat(endVertexList)
      );
      this.multipleSelectInfo = multipleSelectInfo;
      /**
       * @description: 框选单元格操作，返回框选的点中有被合并的点
       */
      const mergeToPoints = this[TYPES.BOX_SELECT_BY_LIMIT](multipleSelectInfo);
      /**
       * @description: 被合并的点的顶点信息
       */
      if (mergeToPoints.length > 0) {
        let mergeToPointsVertexList = [];
        mergeToPoints.forEach((baseAttr) => {
          /**
           * @description: 获取合并点的顶点信息
           */
          mergeToPointsVertexList = mergeToPointsVertexList.concat(
            this[TYPES.GET_VERTEX_POSITION](baseAttr)
          );
        });
        /**
         * @description: 再次对比合并点和已框选点
         */
        const newMultipleSelectInfo = this[TYPES.CHECK_VERTEX_POSITION_LIST](
          mergeToPointsVertexList.concat(multipleSelectInfo.vertex)
        );
        this.multipleSelectInfo = newMultipleSelectInfo;
        this[TYPES.BOX_SELECT_BY_LIMIT](newMultipleSelectInfo);
      }
    }
  }

  /**
   * @description: 框选-基于行列位置极值
   * @param {TableForm.MultipleSelectInfo} {minRowIndex,minColIndex,maxRowIndex, maxColIndex}
   * @return: 含有被合并的单元格集合
   */
  [TYPES.BOX_SELECT_BY_LIMIT]({ minRowIndex, minColIndex, maxRowIndex, maxColIndex }) {
    /**
     * @description: 框选的点中有被合并的点
     */
    const mergeToPoints = {};
    const result = [];
    /**
     * @description: *Len：长度带方向；*LenAbs：长度不带方向；*Step：步长带方向-1或+1
     */
    const rowLen = maxRowIndex - minRowIndex;
    const rowLenAbs = Math.abs(rowLen);
    const rowStep = rowLen === 0 ? 0 : rowLenAbs / rowLen;
    const colLen = maxColIndex - minColIndex;
    const colLenAbs = Math.abs(colLen);
    const colStep = colLen === 0 ? 0 : colLenAbs / colLen;

    /**
     * @description: 遍历初始位置到框选位置，选中
     */
    for (let r = 0; r <= rowLenAbs; r++) {
      const curRowIndex = minRowIndex + rowStep * r;
      for (let c = 0; c <= colLenAbs; c++) {
        const curColIndex = minColIndex + colStep * c;
        if (this.dataTable[curRowIndex] && this.dataTable[curRowIndex][curColIndex]) {
          const curCell = this.dataTable[curRowIndex][curColIndex];
          /**
           * @description: 如果有合并点则添加到合并点集合
           */
          if (curCell.mergeInfo.mergeTo) {
            const mergeKey = this[TYPES.GET_UNIQUEID]({
              rowIndex: curCell.mergeInfo.mergeTo.position.rowIndex,
              colIndex: curCell.mergeInfo.mergeTo.position.colIndex,
            });
            mergeToPoints[mergeKey] = curCell.mergeInfo.mergeTo;
          }
          /**
           * @description: 如果为合并点且不为端点位置则添加到合并点集合
           */
          if (
            r !== rowLenAbs ||
            (c !== colLenAbs && curCell.baseAttr.rowspan > 1) ||
            curCell.baseAttr.colspan > 1
          ) {
            const mergeKey = curCell.id;
            mergeToPoints[mergeKey] = curCell.baseAttr;
          }
          this[TYPES.ADD_CHECKED](curCell);
        }
      }
    }
    _forEach(mergeToPoints, (baseAttr) => {
      result.push(baseAttr);
    });
    return result;
  }

  /**
   * @description: 拖拽框选单元格
   * @param {TableForm.CellData} cellData
   * @param {MouseEvent} event
   */
  [TYPES.HANDLE_MOUSEDOWN](cellData, event) {
    const key = cellData.id;
    /**
     * @description: 为右键点击且在合并区域内或按下了shift，则不做任何操作
     */
    if ((event.which === 3 && this.dataChecked[key]) || event.shiftKey) {
      return;
    }
    this[TYPES.SELECT_FIRST](cellData);
    this.startMousedown = true;
  }

  /**
   *
   * @param {TableForm.CellData} cellData
   */
  [TYPES.HANDLE_MOUSEMOVE](cellData) {
    if (this.startMousedown) {
      this[TYPES.BOX_SELECT](cellData);
    }
  }

  /**
   *
   * @param {TableForm.CellData} cellData
   */
  [TYPES.HANDLE_MOUSEUP](cellData) {
    if (this.startMousedown) {
      this.startMousedown = false;
      this[TYPES.BOX_SELECT](cellData);
    }
  }
}

/*
 * @Description: 数据模块(Base->Event->Data)
 */
import { cloneDeep as _cloneDeep } from 'lodash';
import * as TYPES from './types/table-types';
import EventModule from './Event';

export default class DataModule extends EventModule {
  /**
   * @description: 记录数据
   * @param {string} id
   * @param {TableForm.CellPosition} cellPosition
   */
  [TYPES.ADD_CONTENT_RECORD](key, cellPosition) {
    this.$set(this.contentRecord, key, cellPosition);
    this.onCellChange();
  }

  /**
   * @description: 删除数据
   * @param {TableForm.CellPosition} {rowIndex, colIndex}
   */
  [TYPES.DEL_CONTENT_RECORD]({ rowIndex, colIndex }) {
    this.dataTable[rowIndex][colIndex].label = '';
    this.dataTable[rowIndex][colIndex].defaultValue = null;
    this.dataTable[rowIndex][colIndex].component = undefined;
    const key = this[TYPES.GET_UNIQUEID]({ rowIndex, colIndex });
    this.$delete(this.contentRecord, key);
  }

  /**
   * @description: 清空已选点
   */
  [TYPES.CLEAR_CHECKED]() {
    this.multipleSelectInfo = null;
    this.dataChecked = {};
  }

  /**
   * @description: 添加被选点
   * @param { TableForm.CellData} cellData
   */
  [TYPES.ADD_CHECKED](cellData) {
    this.$set(this.dataChecked, cellData.id, cellData);
  }

  /**
   * @description: 选中第一个点
   * @param {TableForm.CellData}
   */
  [TYPES.SELECT_FIRST](cellData) {
    /**
     * @description: 隐藏右键菜单
     */
    this.showContextMenu = false;
    this[TYPES.CLEAR_CHECKED]();
    this[TYPES.ADD_CHECKED](cellData);
    this.checkedCellFirst = cellData;
    this.checkedCellLast = cellData;
  }

  /**
   * @description: 添加label项
   * @param {TableForm.CellPosition} cellPosition
   * @param {string} label
   */
  [TYPES.ADD_LABEL_ITEM](cellPosition, label) {
    if (!label) {
      return;
    }
    this.labelList[label] = cellPosition;
  }

  /**
   * @description: 删除label项
   * @param {string | TableForm.CellPosition} payload
   */
  [TYPES.DEL_LABEL_ITEM](payload) {
    if (!payload) {
      return;
    }
    if (typeof payload === 'string') {
      this.$delete(this.labelList, payload);
    } else {
      const { rowIndex, colIndex } = payload;
      const cellData = this.dataTable[rowIndex][colIndex];
      if (cellData.label) {
        this.$delete(this.labelList, cellData.label);
      }
    }
  }

  /**
   * @description: 修改单元格label字段
   * @param {TableForm.CellPosition} { rowIndex, colIndex }
   * @param {string} label
   */
  [TYPES.MODIFY_CELL_DATA_LABEL]({ rowIndex, colIndex }, label) {
    this.dataTable[rowIndex][colIndex].label = label;
    /**
     * @description: 重新触发一下点击操作
     */
    const cellData = this.dataTable[rowIndex][colIndex];
    this[TYPES.SELECT_FIRST](cellData);
    this.onClickCol(cellData);
    this.onCellChange();
  }

  /**
   * @description: 检查标签重复性--重复则修改单元格label字段--添加到label列表
   * @param {TableForm.CellPosition} cellPosition
   * @param {string} label
   */
  [TYPES.CHECK_LABEL_REPEAT](cellPosition, label) {
    if (!label) {
      return;
    }
    let doneLabel = label;
    /**
     * @description: 检测label存在性修改label--例 xx(1)
     */
    while (this.labelList[doneLabel]) {
      const regExp = /\(\d\)$/g;
      const matchNumberArr = doneLabel.match(regExp) || [];
      if (matchNumberArr.length !== 0) {
        let str = matchNumberArr[0];
        let newNumber = Number(str.substring(1, str.length - 1)) + 1;
        doneLabel = doneLabel.replace(regExp, `(${newNumber})`);
      } else {
        doneLabel += '(1)';
      }
    }
    this[TYPES.MODIFY_CELL_DATA_LABEL](cellPosition, doneLabel);
    this[TYPES.ADD_LABEL_ITEM](cellPosition, doneLabel);
  }

  /**
   * @description: 设置单元格数据-通常给外部组件调用
   * @param { TableForm.CellData } cellData 新的单元格数据，包含完整信息
   */
  [TYPES.SET_CELL_DATA](cellData) {
    const { rowIndex, colIndex } = cellData.baseAttr.position;
    const originLabel = this.dataTable[rowIndex][colIndex].label;
    this.$set(this.dataTable[rowIndex], colIndex, cellData);
    this.onCellChange();
    this[TYPES.ADD_CONTENT_RECORD](cellData.id, cellData.baseAttr.position);
    this[TYPES.DEL_LABEL_ITEM](originLabel);
    this[TYPES.ADD_LABEL_ITEM](cellData.baseAttr.position, cellData.label);
  }

  /**
   * @description: 设置表格数据-通常给外部组件调用
   * @param { TableForm.CellData[][] } dataTable 新的单元格数据，包含完整信息
   */
  [TYPES.SET_TABLE_DATA](dataTable) {
    dataTable.forEach((rowData) => {
      rowData.forEach((cellData) => {
        this[TYPES.SET_CELL_DATA](_cloneDeep(cellData));
      });
    });
  }
}

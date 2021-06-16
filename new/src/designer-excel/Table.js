import * as TYPES from './types/table-types';
import { join as _join } from 'lodash';

/**
 * @description: 位置连接符号
 */
export const JOIN_SYMBOL = '_';

export default class TableModule {
  constructor({ cellSize, tableSize, border }) {
    /**
     * @description: 单元格尺寸
     * @type: TableForm.CellSize
     */
    this.cellSize = cellSize || { width: 150, height: 32 };

    /**
     * @description: 表格尺寸
     * @type: TableForm.TableSize
     */
    this.tableSize = tableSize || { width: 10, height: 10 };

    /**
     * @description: 是否拥有边框
     * @type: boolean
     */
    this.border = border || true;

    /**
     * @description: 是否显示间隔斑马纹
     * @type: boolean
     */
    this.stripe = stripe || true;

    this.joinSymbol = JOIN_SYMBOL;
  }

  /**
   * @description: 表格宽度
   */
  get tableWidth() {
    return this.tableSize.width * this.cellSize.width * 2 + 'px';
  }

  /**
   * @description: 计算合并单元格样式
   * @param col TableForm.CellData
   */
  calculateStyle(col) {
    const cell = col;
    let rowspan = cell.baseAttr.rowspan;
    let colspan = cell.baseAttr.colspan;
    let zIndex = 1;
    const borderSize = this.border ? rowspan - 1 : 0;
    if (rowspan > 1 || colspan > 1) {
      zIndex = 10;
    }

    return {
      flex: colspan,
      width: this.cellSize.width * colspan + 'px',
      height: this.cellSize.height * rowspan + borderSize + 'px',
      lineHeight: this.cellSize.height * rowspan + borderSize + 'px',
      zIndex,
    };
  }

  /**
   * @description: 根据位置信息获取id
   * @param {TableForm.CellPosition}
   */
  [TYPES.GET_UNIQUEID]({ rowIndex, colIndex }) {
    return _join([rowIndex, colIndex], this.joinSymbol);
  }

  /**
   * @description: 拆分id获取位置信息
   * @param {string} id
   * @returns {TableForm.CellPosition}
   */
  [TYPES.GET_POSITION_BY_ID](id) {
    const positionArr = id.split(this.joinSymbol);
    return { rowIndex: Number(positionArr[0]), colIndex: Number(positionArr[1]) };
  }

  /**
   * @description: 组件属性默认值
   * @param {*} attribute
   * @param {*} defaultValue
   * @returns {*}
   */
  handleAttribute(attribute, defaultValue) {
    if (attribute === false || attribute === 0 || attribute === '') {
      return attribute;
    }
    return attribute || defaultValue;
  }
}

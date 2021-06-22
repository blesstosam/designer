/*
 * @Description: 工具模块(Base->Util)
 */
import { forEach as _forEach } from 'lodash';
import * as TYPES from './types/table-types';
import BaseUtil from './Base';

export default class UtilModule extends BaseUtil {
  /**
   * @description: 根据id获取单元格数据
   * @param {string} id
   * @returns {TableForm.CellData | null}
   */
  [TYPES.GET_CELL_DATA_BY_ID](id) {
    const { rowIndex, colIndex } = this[TYPES.GET_POSITION_BY_ID](id);
    if (this.dataTable[rowIndex] && this.dataTable[rowIndex][colIndex]) {
      return this.dataTable[rowIndex][colIndex];
    }
    return null;
  }

  /**
   * @description: 根据位置信息获取单元格数据
   * @param {TableForm.CellPosition} position
   */
  [TYPES.GET_CELL_DATA_BY_POSITION](position) {
    const id = this[TYPES.GET_UNIQUEID](position);
    return this[TYPES.GET_CELL_DATA_BY_ID](id);
  }

  /**
   * @description: 获取顶点位置信息（最多4顶点
   * @param {TableForm.CellBaseAttr}
   * @returns {TableForm.CellPosition[]}
   */
  [TYPES.GET_VERTEX_POSITION]({ rowspan, colspan, position }) {
    const leftTop = position;
    const rightTop = {
      rowIndex: position.rowIndex,
      colIndex: position.colIndex + colspan - 1,
    };
    const leftBottom = {
      rowIndex: position.rowIndex + rowspan - 1,
      colIndex: position.colIndex,
    };
    const rightBottom = {
      rowIndex: position.rowIndex + rowspan - 1,
      colIndex: position.colIndex + colspan - 1,
    };
    return [leftTop, rightTop, leftBottom, rightBottom];
  }

  /**
   * @description: 获取边界
   * @returns {data: TableForm.CellData[][]; size: TableForm.TableSize }
   */
  [TYPES.GET_BOUNDARY]() {
    let vertexList = [];
    _forEach(this.contentRecord, ({ rowIndex, colIndex }) => {
      if (this.dataTable[rowIndex]) {
        const cellData = this.dataTable[rowIndex][colIndex];
        if (cellData && cellData.type) {
          vertexList = vertexList.concat(this[TYPES.GET_VERTEX_POSITION](cellData.baseAttr));
        }
      }
    });
    const { minRowIndex, minColIndex, maxRowIndex, maxColIndex } = this[
      TYPES.CHECK_VERTEX_POSITION_LIST
    ](vertexList);

    let resultData = this.dataTable.slice(minRowIndex, maxRowIndex + 1);
    resultData = resultData.map((col) => {
      return col.slice(minColIndex, maxColIndex + 1);
    });
    return {
      data: resultData,
      size: { width: maxColIndex - minColIndex + 1, height: maxRowIndex - minRowIndex + 1 },
    };
  }

  /**
   * @description: 对比多个点位置信息，返回框选信息
   * @param {TableForm.CellPosition[]} data
   * @returns {TableForm.MultipleSelectInfo}
   */
  [TYPES.CHECK_VERTEX_POSITION_LIST](data) {
    let minRowIndex = 0;
    let minColIndex = 0;
    let maxRowIndex = 0;
    let maxColIndex = 0;
    let isFirst = true;
    data.forEach(({ rowIndex, colIndex }) => {
      if (isFirst) {
        minRowIndex = rowIndex;
        minColIndex = colIndex;
        maxRowIndex = rowIndex;
        maxColIndex = colIndex;
        isFirst = false;
        return;
      }
      if (minRowIndex > rowIndex) {
        minRowIndex = rowIndex;
      } else if (maxRowIndex < rowIndex) {
        maxRowIndex = rowIndex;
      }
      if (minColIndex > colIndex) {
        minColIndex = colIndex;
      } else if (maxColIndex < colIndex) {
        maxColIndex = colIndex;
      }
    });
    return {
      minRowIndex,
      minColIndex,
      maxRowIndex,
      maxColIndex,
      vertex: [
        { rowIndex: minRowIndex, colIndex: minColIndex },
        { rowIndex: minRowIndex, colIndex: maxColIndex },
        { rowIndex: maxRowIndex, colIndex: minColIndex },
        { rowIndex: maxRowIndex, colIndex: maxColIndex },
      ],
    };
  }
}

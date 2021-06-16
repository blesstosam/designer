/*
 * @Description: 基础模块
 */
import TableModule from './Table';

export default class BaseModule extends TableModule {
  constructor(groupName) {
    /**
     * @description: 拖拽组名，需要名字相同才可进行拖拽
     */
    this.groupName = groupName || '';

    // @Ref('tableContainer') readonly tableContainerComponent!: HTMLElement;
    // this.tableContainerComponent = ? // HTMLElement

    /**
     * @description: 表格数据
     * @type: TableForm.CellData[][]
     */
    this.dataTable = [];

    /**
     * @description: 记录已拖放数据
     * @type: Dictionary<TableForm.CellPosition>
     */
    this.contentRecord = {};

    /**
     * @description: 选中cell列表
     * @type: Dictionary<TableForm.CellData>
     */
    this.dataChecked = {};

    /**
     * @description: 记录已拖放数据label列表
     * @type: Dictionary<TableForm.CellPosition>
     */
    this.labelList = {};

    /**
     * @description: 第一个选中的cell
     * @type: TableForm.CellData | null
     */
    this.checkedCellFirst = null;

    /**
     * @description: 最后一个选中的cell
     * @type: TableForm.CellData | null
     */
    this.checkedCellLast = null;

    /**
     * @description: 右键菜单显示
     * @@type: boolean
     */
    this.showContextMenu = false;

    /**
     * @description: 右键菜单位置
     * @type: TableForm.Position
     */
    this.positionContextMenu = { x: 0, y: 0 };

    /**
     * @description: 是否可以合并单元格
     * @type: boolean
     */
    this.canMergeCell = true;

    /**
     * @description: 是否可以拆分单元格
     * @type: boolean
     */
    this.canSplitCell = false;

    /**
     * @description: 框选信息
     * @type: TableForm.MultipleSelectInfo | null
     */
    this.multipleSelectInfo = null;

    /**
     * @description: 需要隐藏的单元格--合并单元格时需要用到
     * @type: Dictionary<TableForm.CellPosition>
     */
    this.needHideCellIdList = {};

    /**
     * @description: 鼠标落下开始
     * @type: boolean
     */
    this.startMousedown = false;
  }
}

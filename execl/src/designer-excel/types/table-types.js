/**
 * @description: 监听按键事件
 */
export const HANDLE_KEYUP = 'handleKeyup';

/**
 * @description: 鼠标拖动至元素上方
 */
export const HANDLE_DRAGOVER = 'handleDragover';

/**
 * @description: 鼠标拖动移出元素
 */
export const HANDLE_DRAGLEAVE = 'handleDragleave';

/**
 * @description: 鼠标放下
 */
export const HANDLE_DROP = 'handleDrop';

/**
 * @description: 获取边界
 */
export const GET_BOUNDARY = 'getBoundary';

/**
 * @description: 根据位置信息获取id
 */
export const GET_UNIQUEID = 'getUniqueID';

/**
 * @description: 拆分id获取位置信息
 */
export const GET_POSITION_BY_ID = 'getPositionById';

/**
 * @description: 记录拖拽数据
 */
export const ADD_CONTENT_RECORD = 'addContentRecord';

/**
 * @description: 删除拖拽数据
 */
export const DEL_CONTENT_RECORD = 'delContentRecord';

/**
 * @description: 添加被选点
 */
export const ADD_CHECKED = 'addChecked';

/**
 * @description: 合并单元格
 */
export const HANDLE_MERGE_CELL = 'handleMergeCell';

/**
 * @description: 拆分单元格
 */
export const HANDLE_SPLIT_CELL = 'handleSplitCell';

/**
 * @description: 删除单元格内容
 */
export const HANDLE_DELETE = 'handleDelete';

/**
 * @description: 点击单元格
 */
export const HANDLE_CLICK_CELL = 'handleClickCell';

/**
 * @description: 选中第一个点
 */
export const SELECT_FIRST = 'selectFirst';

/**
 * @description: 清空已选点
 */
export const CLEAR_CHECKED = 'clearChecked';

/**
 * @description: 框选-基于第一个点和最后一个点
 */
export const BOX_SELECT = 'boxSelect';

/**
 * @description: 框选-基于行列位置极值
 */
export const BOX_SELECT_BY_LIMIT = 'boxSelectByLimit';

/**
 * @description: 获取顶点位置信息（最多4顶点）
 */
export const GET_VERTEX_POSITION = 'getVertexPosition';

/**
 * @description: 对比多个点位置信息，返回框选信息
 */
export const CHECK_VERTEX_POSITION_LIST = 'checkVertexPositionList';

/**
 * @description: 右击单元格
 */
export const HANDLE_CONTEXTMENU = 'handleContextmenu';

/**
 * @description: 拖拽框选单元格功能-鼠标按下
 */
export const HANDLE_MOUSEDOWN = 'handleMousedown';

/**
 * @description: 拖拽框选单元格功能-鼠标移动
 */
export const HANDLE_MOUSEMOVE = 'handleMousemove';

/**
 * @description: 拖拽框选单元格功能-鼠标抬起
 */
export const HANDLE_MOUSEUP = 'handleMouseup';

/**
 * @description: 根据id获取单元格数据
 */
export const GET_CELL_DATA_BY_ID = 'getCellDataById';

/**
 * @description: 根据位置信息获取单元格数据
 */
export const GET_CELL_DATA_BY_POSITION = 'getCellDataByPosition';

/**
 * @description: 添加label项
 */
export const ADD_LABEL_ITEM = 'addLabelItem';

/**
 * @description: 删除label项
 */
export const DEL_LABEL_ITEM = 'delLabelItem';

/**
 * @description: 检查标签重复性
 */
export const CHECK_LABEL_REPEAT = 'checkLabelRepeat';

/**
 * @description: 修改单元格label字段
 */
export const MODIFY_CELL_DATA_LABEL = 'modifyCellDataLabel';

/**
 * @description: 设置单元格数据-通常给外部组件调用
 */
export const SET_CELL_DATA = 'setCellData';

/**
 * @description: 设置表格数据-通常给外部组件调用
 */
export const SET_TABLE_DATA = 'setTableData';

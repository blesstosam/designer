export default {
  type: 'object',
  title: '分栏',
  description: '将一行划分为24等分的布局组件，用于表单分列',
  properties: {
    id: {
      const: 'column'
    },
    icon: {
      const: 'icon-column'
    },
    configs: {
      type: 'array',
      items: [
        {
          type: 'object',
          title: '属性',
          properties: {
            id: {
              const: '_props'
            },
            children: {
              type: 'array',
              items: [
                {
                  type: 'object',
                  // title: '栏数',
                  properties: {
                    id: {
                      const: 'colRatio'
                    },
                    formType: {
                      const: 'column-setting'
                    },
                    value: {
                      type: 'string',
                      default: '12:12'
                    }
                  }
                },

                {
                  type: 'object',
                  title: '删格间距',
                  properties: {
                    id: {
                      const: 'gutter'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'object',
                      default: 8,
                      enum: [8, 12, 16],
                      enumLabel: [ '8px', '12px', '16px']
                    }
                  }
                },

                {
                  type: 'object',
                  title: '内容布局',
                  properties: {
                    id: {
                      const: 'align'
                    },
                    formType: {
                      const: 'vertical-align'
                    },
                    value: {
                      type: 'string',
                      default: 'flex-start',
                      enum: ['flex-start', 'center'],
                      enumLabel: ['flex-start', 'center']
                    }
                  }
                },

                {
                  type: 'object',
                  title: '内容对齐',
                  properties: {
                    id: {
                      const: 'rowAlign'
                    },
                    formType: {
                      const: 'row-align'
                    },
                    value: {
                      type: 'string',
                      default: 'flex-start',
                      enum: ['flex-start', 'center', 'flex-end'],
                      enumLabel: ['flex-start', 'center', 'flex-end'],
                    }
                  }
                },

                {
                  type: 'object',
                  title: '背景颜色',
                  properties: {
                    id: {
                      const: 'bgColor'
                    },
                    formType: {
                      const: 'color-picker'
                    },
                    value: {
                      type: 'string',
                      default: ''
                    }
                  }
                }
              ]
            }
          }
        }
      ]
    }
  }
}

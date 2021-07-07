export default {
  type: 'object',
  title: '区块',
  description: '独占一行的基础布局组件，可将页面划分为若干区域',
  properties: {
    id: {
      const: 'block'
    },
    icon: {
      const: 'icon-block'
    },
    configs: {
      type: 'array',
      items: [
        {
          type: 'object',
          title: '样式',
          properties: {
            id: {
              const: '_styles'
            },
            children: {
              type: 'array',
              items: [
                {
                  type: 'object',
                  title: '上边距',
                  properties: {
                    id: {
                      const: 'paddingTop'
                    },
                    formType: {
                      const: 'input-number'
                    },
                    value: {
                      type: 'number',
                      default: 0
                    }
                  }
                }
              ]
            }
          }
        },
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
                  title: '背景颜色',
                  properties: {
                    id: {
                      const: 'backgroundColor'
                    },
                    formType: {
                      const: 'color-picker'
                    },
                    value: {
                      type: 'string',
                      default: ''
                    }
                  }
                },

                {
                  type: 'object',
                  title: '文字对齐',
                  properties: {
                    id: {
                      const: 'textAlign'
                    },
                    formType: {
                      const: 'row-align'
                    },
                    value: {
                      type: 'string',
                      default: 'left',
                      enum: ['left', 'center', 'right']
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

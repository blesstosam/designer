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
        // 基础
        // {
        //   type: 'object',
        //   title: '基础',
        //   properties: {
        //     id: {
        //       const: 'basic'
        //     },
        //     children: {}
        //   }
        // },

        // 文字样式
        {
          type: 'object',
          title: '样式',
          properties: {
            id: {
              const: '_style'
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
                },

                {
                  type: 'object',
                  title: '上边距',
                  properties: {
                    id: {
                      const: 'paddingTop'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'object',
                      default: { label: '8px', value: '8px' },
                      enum: [
                        { label: '8px', value: '8px' },
                        { label: '16px', value: '16px' },
                        { label: '32px', value: '32px' }
                      ]
                    }
                  }
                }

                // TODO 参考iceworks插件的边距设置 margin/padding
              ]
            }
          }
        }
      ]
    }
  }
}

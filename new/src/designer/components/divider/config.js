export default {
  type: 'object',
  title: '分割线',
  description: '区隔内容的分割线',
  properties: {
    id: {
      const: 'divider'
    },
    icon: {
      const: 'icon-divider'
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
                  title: '文案',
                  properties: {
                    id: {
                      const: 'content'
                    },
                    formType: {
                      const: 'input'
                    },
                    value: {
                      type: 'string',
                      default: '文字'
                    }
                  }
                },

                {
                  type: 'object',
                  title: '文案位置',
                  properties: {
                    id: {
                      const: 'content-position'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'string',
                      default: 'left',
                      enum: ['left', 'right', 'center'],
                      enumLabel: ['left', 'right', 'center']
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

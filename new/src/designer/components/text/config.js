export default {
  type: 'object',
  title: '文字',
  description: '用于显示一段文字',
  properties: {
    id: {
      const: 'text'
    },
    icon: {
      const: 'icon-text'
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
                  title: '内容',
                  properties: {
                    id: {
                      const: 'content'
                    },
                    formType: {
                      const: 'textarea'
                    },
                    value: {
                      type: 'string',
                      default: '文字'
                    }
                  }
                },

                {
                  type: 'object',
                  title: '颜色',
                  properties: {
                    id: {
                      const: 'color'
                    },
                    formType: {
                      const: 'color-picker'
                    },
                    value: {
                      type: 'string',
                      default: '#000'
                    }
                  }
                },

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
                  title: '字高',
                  properties: {
                    id: {
                      const: 'fontSize'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'object',
                      default: { label: '14px', value: '14px' },
                      enum: [
                        { label: '14px', value: '14px' },
                        { label: '16px', value: '16px' },
                        { label: '18px', value: '18px' },
                        { label: '20px', value: '20px' }
                      ]
                    }
                  }
                },

                {
                  type: 'object',
                  title: '字重',
                  properties: {
                    id: {
                      const: 'fontWeight'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'object',
                      default: { label: '400', value: '400' },
                      enum: [
                        { label: '400', value: '400' },
                        { label: '700', value: '700' },
                        { label: '900', value: '900' }
                      ]
                    }
                  }
                },

                {
                  type: 'object',
                  title: '文字样式',
                  properties: {
                    id: {
                      const: 'fontStyle'
                    },
                    formType: {
                      const: 'text-style'
                    },
                    value: {
                      type: 'string',
                      default: 'normal',
                      enum: ['normal', 'italic']
                    }
                  }
                },

                {
                  type: 'object',
                  title: '文字装饰',
                  properties: {
                    id: {
                      const: 'textDecoration'
                    },
                    formType: {
                      const: 'text-decoration'
                    },
                    value: {
                      type: 'string',
                      default: 'none',
                      enum: ['none', 'overline', 'underline', 'line-through']
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

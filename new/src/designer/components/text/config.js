const json = {
  title: '文字',
  description: '用于显示一段文字',
  id: 'text',
  icon: 'icon-text',
  configs: [
    {
      title: '基础',
      id: 'basic',
      children: [
        {
          title: '内容',
          id: 'content',
          default: '文字',
          value: '',
          formType: 'input'
        },
        {
          title: '颜色',
          id: 'color',
          default: '#000',
          value: '',
          formType: 'color-picker'
        },
        {
          title: '背景颜色',
          id: 'backgroundColor',
          default: '',
          value: '',
          formType: 'color-picker'
        },
        {
          title: '字高',
          id: 'fontSize',
          default: '14px',
          value: '',
          formType: 'select',
          options: [
            { label: '14px', value: '14px' },
            { label: '16px', value: '16px' },
            { label: '18px', value: '18px' }
          ]
        },
        {
          title: '字重',
          id: 'fontWeight',
          default: '400',
          value: '',
          formType: 'select',
          options: [
            { label: '400', value: '400' },
            { label: '700', value: '700' },
            { label: '900', value: '900' }
          ]
        },
        {
          title: '文字样式',
          id: 'fontStyle',
          default: 'normal',
          value: '',
          formType: 'text-style'
        },
        {
          title: '文字装饰',
          id: 'textDecoration',
          default: 'none',
          value: '',
          formType: 'text-decoration'
        },
        {
          title: '文字对齐',
          id: 'textAlign',
          default: 'left',
          value: '',
          formType: 'row-align'
        }
      ]
    }
  ]
}

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
        // 基础
        {
          type: 'object',
          title: '基础',
          properties: {
            id: {
              const: 'basic'
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

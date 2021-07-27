export default {
  type: 'object',
  title: '标签',
  description: '用于标记和选择',
  properties: {
    id: {
      const: 'tag'
    },
    icon: {
      const: 'icon-tag'
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
                  title: '类型',
                  properties: {
                    id: {
                      const: 'type'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'string',
                      default: 'success',
                      enum: ['success', 'info', 'warning', 'danger'],
                      enumLabel: ['success', 'info', 'warning', 'danger']
                    }
                  }
                },

                {
                  type: 'object',
                  title: '尺寸',
                  properties: {
                    id: {
                      const: 'size'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'string',
                      default: 'medium',
                      enum: ['medium', 'small', 'mni'],
                      enumLabel: ['medium', 'small', 'mni']
                    }
                  }
                },

                {
                  type: 'object',
                  title: '主题',
                  properties: {
                    id: {
                      const: 'size'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'string',
                      default: 'dark',
                      enum: ['dark', 'light', 'plain'],
                      enumLabel: ['dark', 'light', 'plain']
                    }
                  }
                },

                {
                  type: 'object',
                  title: '是否可关闭',
                  properties: {
                    id: {
                      const: 'closable'
                    },
                    formType: {
                      const: 'radio'
                    },
                    value: {
                      type: 'boolean',
                      default: false
                    }
                  }
                },

                {
                  type: 'object',
                  title: '是否禁用渐变动画',
                  properties: {
                    id: {
                      const: 'disable-transitions'
                    },
                    formType: {
                      const: 'radio'
                    },
                    value: {
                      type: 'boolean',
                      default: false
                    }
                  }
                },

                {
                  type: 'object',
                  title: '是否有边框描边',
                  properties: {
                    id: {
                      const: 'hit'
                    },
                    formType: {
                      const: 'radio'
                    },
                    value: {
                      type: 'boolean',
                      default: false
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
                }
              ]
            }
          }
        }
      ]
    }
  }
}

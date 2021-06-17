export default {
  type: 'object',
  title: '输入框',
  description: '用于用户输入一些文本',
  properties: {
    id: {
      const: 'input'
    },
    icon: {
      const: 'icon-input'
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
                      const: 'value'
                    },
                    formType: {
                      const: 'input'
                    },
                    value: {
                      type: 'string',
                      default: ''
                    }
                  }
                },

                {
                  type: 'object',
                  title: '占位字符',
                  properties: {
                    id: {
                      const: 'placeholder'
                    },
                    formType: {
                      const: 'input'
                    },
                    value: {
                      type: 'string',
                      default: '请输入'
                    }
                  }
                },

                {
                  type: 'object',
                  title: '禁用',
                  properties: {
                    id: {
                      const: 'disabled'
                    },
                    formType: {
                      const: 'switch'
                    },
                    value: {
                      type: 'boolean',
                      default: false
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
                      type: 'object',
                      default: { label: 'medium', value: 'medium' },
                      enum: [
                        { label: 'large', value: 'large' },
                        { label: 'medium', value: 'medium' },
                        { label: 'small', value: 'small' },
                        { label: 'mini', value: 'mini' }
                      ]
                    }
                  }
                },

                {
                  type: 'object',
                  title: '图标',
                  properties: {
                    id: {
                      const: 'prefix-icon'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'object',
                      default: { label: '', value: '' },
                      enum: [
                        { label: 'el-icon-search', value: 'el-icon-search' },
                        { label: 'el-icon-date', value: 'el-icon-date' }
                      ]
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

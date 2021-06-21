const json = {
  title: '按钮',
  description: '用于触发业务事件，支持按钮样式设置',
  id: 'button',
  icon: 'icon-button',
  configs: [
    {
      title: '基础',
      id: 'basic',
      children: [
        {
          title: '按钮名称',
          id: 'content',
          default: '按钮',
          value: '',
          formType: 'input'
          // props: {
          //   maxLength: 6
          // }
        },
        {
          title: '事件',
          id: '__eventname',
          default: '打印',
          value: '',
          formType: 'select',
          options: ['打印', '编辑', '共享']
        },
        {
          title: '悬停时显示',
          id: '__hovercontent',
          default: '',
          value: '',
          formType: 'input',
          props: {}
        },
        {
          title: '显示方式',
          id: '__displayway',
          default: 'text',
          value: '',
          formType: 'select',
          options: [
            { label: '名称', value: 'text' },
            { label: '图标', value: 'icon' },
            { label: '图标+名称', value: 'icon-text' },
            { label: '名称+图标', value: 'text-icon' }
          ]
        },
        {
          title: '选择图标',
          id: '__chooseicon',
          default: '',
          value: '',
          formType: 'select'
        },
        {
          title: '按钮尺寸',
          id: '__buttonsize',
          default: '',
          value: '',
          formType: 'select',
          options: [
            { label: '大', value: 'big' },
            { label: '标准', value: 'medium' },
            { label: '小', value: 'small' }
          ]
        },
        {
          title: '按钮色',
          id: '__bgcolor',
          default: '#4680FF',
          value: '',
          formType: 'color-radio',
          options: ['#4680FF', '#FF8C31', '#27C540', '#FF4C4C', '#FFFFFF']
        }
      ]
    },

    {
      title: '样式',
      id: '_style',
      children: [
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
          title: '样式',
          id: 'fontStyle',
          default: 'normal',
          value: '',
          formType: 'text-style'
        }
      ]
    },

    {
      title: '样式库',
      id: '_stylerepo',
      children: [
        {
          title: '按钮样式',
          id: '__btnstyle',
          default: '',
          value: '',
          formType: 'btn-style',
          options: ['', 'round', 'plain']
        }
      ]
    }
  ]
}

export default {
  type: 'object',
  title: '按钮',
  description: '用于触发业务事件，支持按钮样式设置',
  properties: {
    id: {
      const: 'button'
    },
    icon: {
      const: 'icon-button'
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
                  title: '按钮名称',
                  properties: {
                    id: {
                      const: 'content'
                    },
                    formType: {
                      const: 'input'
                    },
                    value: {
                      type: 'string',
                      default: '按钮',
                      maxLength: 6
                    }
                  }
                },
                // {
                //   type: 'object',
                //   title: '事件',
                //   properties: {
                //     id: {
                //       const: '__eventname'
                //     },
                //     formType: {
                //       const: 'select'
                //     },
                //     value: {
                //       type: 'string',
                //       default: '打印',
                //       enum: ['打印', '编辑', '共享']
                //     }
                //   }
                // },

                {
                  type: 'object',
                  title: '悬停时显示',
                  properties: {
                    id: {
                      const: '__hovercontent'
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
                  title: '显示方式',
                  properties: {
                    id: {
                      const: '__displayway'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'object',
                      default: { label: '名称', value: 'text' },
                      enum: [
                        { label: '名称', value: 'text' },
                        { label: '图标', value: 'icon' },
                        { label: '图标+名称', value: 'icon-text' }
                        // { label: '名称+图标', value: 'text-icon' }
                      ]
                    }
                  }
                },

                {
                  type: 'object',
                  title: '选择图标',
                  properties: {
                    id: {
                      const: '__chooseicon'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'string',
                      default: '',
                      enum: ['el-icon-edit', 'el-icon-share', 'el-icon-delete']
                    }
                  },
                  // if/then/else 缺一不可
                  if: {
                    // 当 id=__displayway 的字段的 value 为 /icon/
                    properties: { __displayway: { pattern: /icon/ } }
                  },
                  then: {
                    properties: { show: true }
                  },
                  else: {
                    properties: { show: false }
                  }
                },

                {
                  type: 'object',
                  title: '按钮尺寸',
                  properties: {
                    id: {
                      const: '__buttonsize'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'object',
                      default: { label: '标准', value: 'medium' },
                      enum: [
                        { label: '大', value: 'large' },
                        { label: '标准', value: 'medium' },
                        { label: '小', value: 'small' }
                      ]
                    }
                  }
                },

                {
                  type: 'object',
                  title: '按钮色',
                  properties: {
                    id: {
                      const: '__bgcolor'
                    },
                    formType: {
                      const: 'color-radio'
                    },
                    value: {
                      type: 'object',
                      default: { label: '#4680FF', value: 'primary' },
                      enum: [
                        { label: '#4680FF', value: 'primary' },
                        { label: '#FF8C31', value: 'warning' },
                        { label: '#27C540', value: 'success' },
                        { label: '#FF4C4C', value: 'danger' },
                        { label: '#FFFFFF', value: 'default' }
                      ]
                    }
                  }
                }
              ]
            }
          }
        },

        // 文字样式
        {
          type: 'object',
          title: '文字样式',
          properties: {
            id: {
              const: '_style'
            },
            children: {
              type: 'array',
              items: [
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
                        { label: '18px', value: '20px' }
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
                }
              ]
            }
          }
        },

        // 样式库
        {
          type: 'object',
          title: '样式库',
          properties: {
            id: {
              const: '_stylerepo'
            },
            children: {
              type: 'array',
              items: [
                {
                  type: 'object',
                  title: '',
                  properties: {
                    id: {
                      const: '__btnstyle'
                    },
                    formType: {
                      const: 'btn-style'
                    },
                    value: {
                      type: 'string',
                      default: '',
                      // 普通/圆角/plain
                      enum: ['', 'round', 'plain']
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

import * as StyleSchema from '../style-schema'

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
                  title: '按钮名称',
                  // 如果该值是必填的，加上required，required的值都为['value']
                  required: ['value'],
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
                      minLength: 1,
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
                  required: ['value'],
                  properties: {
                    id: {
                      const: '__displayway'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'object',
                      default: 'text',
                      enum: ['text', 'icon', 'icon-text'],
                      enumLabel: ['名称', '图标', '图标+名称']
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
                      enum: ['el-icon-edit', 'el-icon-share', 'el-icon-delete'],
                      enumLabel: ['el-icon-edit', 'el-icon-share', 'el-icon-delete']
                    },
                    disabled: {
                      const: '{formData.__displayway==="text"}'
                    }
                  }
                  //draft7: if/then/else 缺一不可
                  // if: {
                  //   // 当 id=__displayway 的字段的 value 为 /icon/
                  //   properties: { __displayway: { pattern: /icon/ } }
                  // },
                  // then: {
                  //   properties: { show: true }
                  // },
                  // else: {
                  //   properties: { show: false }
                  // }
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
                      default: 'medium',
                      enum: ['large', 'medium', 'small'],
                      enumLabel: ['大', '标准', '小']
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
                      default: 'primary',
                      enum: ['primary', 'warning', 'success', 'danger', 'default'],
                      enumLabel: ['#4680FF', '#FF8C31', '#27C540', '#FF4C4C', '#FFFFFF']
                    }
                  }
                },

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
                      enum: ['', 'round', 'plain'],
                      enumLabel: ['', 'round', 'plain']
                    }
                  }
                }
              ]
            }
          }
        },

        {
          type: 'object',
          title: '样式',
          properties: {
            id: {
              const: '_styles'
            },
            children: {
              type: 'array',
              items: [StyleSchema.FONT_SIZE, StyleSchema.FONT_WEIGHT, StyleSchema.FONT_STYLE]
            }
          }
        }
      ]
    }
  }
}

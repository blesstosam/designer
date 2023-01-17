export default {
  type: 'object',
  title: '选项卡',
  description: '分隔内容上有关联但属于不同类别的数据集合',
  properties: {
    id: {
      const: 'tabs'
    },
    icon: {
      const: 'icon-tabs'
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
                  title: '业签设置',
                  properties: {
                    id: {
                      const: 'tabOptions'
                    },
                    formType: {
                      const: 'tabs-setting'
                    },
                    value: {
                      type: 'array',
                      default: [
                        { label: '业签1', name: 'tabpane1' },
                        { label: '业签2', name: 'tabpane2' }
                      ],
                      items: {
                        type: 'object',
                        properties: {
                          label: 'string',
                          name: 'string'
                        }
                      }
                    }
                  }
                },

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
                      default: { label: '标准', value: 'default' },
                      enum: [
                        { label: '大', value: 'large' },
                        { label: '标准', value: 'default' },
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
                      default: { label: 'primary', value: '#4680FF' },
                      enum: [
                        { label: 'primary', value: '#4680FF' },
                        { label: 'warning', value: '#FF8C31' },
                        { label: 'success', value: '#27C540' },
                        { label: 'danger', value: '#FF4C4C' },
                        { label: 'default', value: '#FFFFFF' }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }

        // 文字样式
        // {
        //   type: 'object',
        //   title: '文字样式',
        //   properties: {
        //     id: {
        //       const: '_styles'
        //     },
        //     children: {
        //       type: 'array',
        //       items: [
        //         {
        //           type: 'object',
        //           title: '字高',
        //           properties: {
        //             id: {
        //               const: 'fontSize'
        //             },
        //             formType: {
        //               const: 'select'
        //             },
        //             value: {
        //               type: 'object',
        //               default: { label: '14px', value: '14px' },
        //               enum: [
        //                 { label: '14px', value: '14px' },
        //                 { label: '16px', value: '16px' },
        //                 { label: '18px', value: '18px' },
        //                 { label: '18px', value: '20px' }
        //               ]
        //             }
        //           }
        //         },

        //         {
        //           type: 'object',
        //           title: '字重',
        //           properties: {
        //             id: {
        //               const: 'fontWeight'
        //             },
        //             formType: {
        //               const: 'select'
        //             },
        //             value: {
        //               type: 'object',
        //               default: { label: '400', value: '400' },
        //               enum: [
        //                 { label: '400', value: '400' },
        //                 { label: '700', value: '700' },
        //                 { label: '900', value: '900' }
        //               ]
        //             }
        //           }
        //         },

        //         {
        //           type: 'object',
        //           title: '文字样式',
        //           properties: {
        //             id: {
        //               const: 'fontStyle'
        //             },
        //             formType: {
        //               const: 'text-style'
        //             },
        //             value: {
        //               type: 'string',
        //               default: 'normal',
        //               enum: ['normal', 'italic']
        //             }
        //           }
        //         }
        //       ]
        //     }
        //   }
        // },

        // // 样式库
        // {
        //   type: 'object',
        //   title: '样式库',
        //   properties: {
        //     id: {
        //       const: '_stylerepo'
        //     },
        //     children: {
        //       type: 'array',
        //       items: [
        //         {
        //           type: 'object',
        //           title: '',
        //           properties: {
        //             id: {
        //               const: '__btnstyle'
        //             },
        //             formType: {
        //               const: 'btn-style'
        //             },
        //             value: {
        //               type: 'string',
        //               default: '',
        //               // 普通/圆角/plain
        //               enum: ['', 'round', 'plain']
        //             }
        //           }
        //         }
        //       ]
        //     }
        //   }
        // }
      ]
    }
  }
}

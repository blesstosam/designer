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
                  title: '字体',
                  properties: {
                    id: {
                      const: 'fontFamily'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'object',
                      default: 'PingFang SC',
                      enum: [
                        'Helvetica Neue',
                        'Helvetica',
                        'PingFang SC',
                        'Hiragino Sans GB',
                        'Microsoft YaHei',
                        '微软雅黑',
                        'Arial',
                        'sans-serif'
                      ]
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
                  title: '外边距',
                  properties: {
                    id: {
                      const: 'margin'
                    },
                    formType: {
                      const: 'margin'
                    },
                    value: {
                      type: 'string',
                      default: '0px 0px 0px 0px'
                    }
                  }
                },
                {
                  type: 'object',
                  title: '内边距',
                  properties: {
                    id: {
                      const: 'padding'
                    },
                    formType: {
                      const: 'margin'
                    },
                    value: {
                      type: 'string',
                      default: '0px 0px 0px 0px'
                    }
                  }
                },
                {
                  type: 'object',
                  title: '圆角',
                  properties: {
                    id: {
                      const: 'borderRadius'
                    },
                    formType: {
                      const: 'margin'
                    },
                    value: {
                      type: 'string',
                      default: '0px 0px 0px 0px'
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
              items: []
            }
          }
        }
      ]
    }
  }
}

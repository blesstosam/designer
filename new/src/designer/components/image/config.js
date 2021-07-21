export default {
  type: 'object',
  title: '图片',
  description: '图片容器，在保留原生img的特性下，支持懒加载，自定义占位、加载失败等',
  properties: {
    id: {
      const: 'image'
    },
    icon: {
      const: 'icon-image'
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
                  title: '图片源',
                  properties: {
                    id: {
                      const: 'src'
                    },
                    formType: {
                      const: 'input'
                    },
                    value: {
                      type: 'string',
                      default: 'https://pic4.zhimg.com/v2-575e45060130ee5a74a4df6d2be66740_xl.jpg'
                    }
                  }
                },

                {
                  type: 'object',
                  title: '适应',
                  properties: {
                    id: {
                      const: 'fit'
                    },
                    formType: {
                      const: 'select'
                    },
                    value: {
                      type: 'string',
                      default: 'fill',
                      enum: ['fill', 'contain', 'cover', 'none', 'scale-down']
                    }
                  }
                },

                {
                  type: 'object',
                  title: '是否开启懒加载',
                  properties: {
                    id: {
                      const: 'lazy'
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
                  title: '是否插入至body',
                  properties: {
                    id: {
                      const: 'append-to-body'
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
                  title: '是否可以通过点击遮罩层关闭',
                  properties: {
                    id: {
                      const: 'hide-on-click-modal'
                    },
                    formType: {
                      const: 'radio'
                    },
                    value: {
                      type: 'boolean',
                      default: false
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

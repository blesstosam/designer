import { expect, test } from '@jest/globals'
import { parse } from '../new/src/designer/lib/parse-schema'

test('Parse schema', () => {
  const schema = {
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
                    title: '上边距',
                    properties: {
                      id: {
                        const: 'paddingTop'
                      },
                      formType: {
                        const: 'input-number'
                      },
                      value: {
                        type: 'number',
                        default: 0
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
                items: [
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
                  }
                ]
              }
            }
          }
        ]
      }
    }
  }

  const parsed = parse(schema)
  // console.log(parsed.configs[0].children)
  expect(parsed.configs).toHaveLength(2)
  expect(parsed.configs[0].title).toBe('样式')
  expect(parsed.configs[0].id).toBe('_styles')
})

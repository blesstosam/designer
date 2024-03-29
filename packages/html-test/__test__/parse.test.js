import { expect, test } from '@jest/globals'
import { parse } from '../new/src/designer/lib/parse-schema'
import * as StyleSchema from '../new/src/designer/components/style-schema'

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

                  StyleSchema.TEXT_ALIGN,

                  StyleSchema.FONT_SIZE
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

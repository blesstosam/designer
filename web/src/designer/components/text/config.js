import * as StyleSchema from '../style-schema'

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
                StyleSchema.FONT_FAMILY,
                StyleSchema.COLOR,
                StyleSchema.BACKGROUND_COLOR,
                StyleSchema.FONT_SIZE,
                StyleSchema.FONT_WEIGHT,
                StyleSchema.FONT_STYLE,
                StyleSchema.TEXT_DECORATION,
                StyleSchema.TEXT_ALIGN
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
                }
              ]
            }
          }
        }
      ]
    }
  }
}

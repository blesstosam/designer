import * as StyleSchema from '../../components/style-schema'

export default {
  type: 'object',
  title: 'VueDemo',
  description: 'VueDemo',
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
                StyleSchema.BACKGROUND_COLOR,
                StyleSchema.MARGIN,
                StyleSchema.PADDING,
                StyleSchema.BORDER_RADIUS,
                StyleSchema.BORDER
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
        },
        {
          type: 'object',
          title: '事件',
          properties: {
            id: {
              const: '_events'
            },
            children: {
              type: 'array',
              items: [
                {
                  type: 'object',
                  title: '原生事件',
                  properties: {
                    id: {
                      const: 'nativeEvent'
                    },
                    formType: {
                      const: 'event-editor'
                    },
                    value: {
                      type: 'string',
                      default: '',
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
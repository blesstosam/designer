import * as StyleSchema from '../style-schema'

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
                StyleSchema.BACKGROUND_COLOR,
                StyleSchema.MARGIN,
                StyleSchema.PADDING,
                StyleSchema.BORDER_RADIUS,
                // StyleSchema.BORDER
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

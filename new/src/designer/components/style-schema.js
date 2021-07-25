export const COLOR = {
  type: 'object',
  title: '颜色',
  properties: {
    id: {
      const: 'color'
    },
    formType: {
      const: 'color-picker'
    },
    value: {
      type: 'string',
      default: '#000'
    }
  }
}

export const FONT_FAMILY = {
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
}

export const BACKGROUND_COLOR = {
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
}

export const FONT_SIZE = {
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

export const FONT_WEIGHT = {
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
}

export const FONT_STYLE = {
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

export const TEXT_DECORATION = {
  type: 'object',
  title: '文字装饰',
  properties: {
    id: {
      const: 'textDecoration'
    },
    formType: {
      const: 'text-decoration'
    },
    value: {
      type: 'string',
      default: 'none',
      enum: ['none', 'overline', 'underline', 'line-through']
    }
  }
}

export const TEXT_ALIGN = {
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
}

export const MARGIN = {
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
}

export const PADDING = {
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
}

export const BORDER_RADIUS = {
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

export const BORDER = {
  type: 'object',
  title: '边框',
  properties: {
    id: {
      const: 'border'
    },
    formType: {
      const: 'border'
    },
    value: {
      type: 'string',
      default: '0px solid #fff'
    }
  }
}
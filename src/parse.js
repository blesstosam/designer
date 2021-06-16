// 将 schema 解析为组件渲染需要的格式

const BASIC_FORM_TYPES = ['Input', 'InputNumber', 'Select', 'Radio', 'Checkbox', 'Switch'];
const LAYOUT_TYPES = ['grid-layout'];

export function getComName(name) {
  return 'v-' + name.toLowerCase();
}

export function _forEach(obj, cb) {
  Object.keys(obj).forEach((k) => {
    cb(obj[k], k);
  });
}

// parse 需要解析两个东西出来
// 1. 用于渲染ui的数组
// 2. 用于存储数据的model
export function parse(schema) {
  const defination = [];
  function _parse(_schema) {
    if (_schema.properties) {
      _forEach(_schema.properties, (item, property) => {
        console.log(item.name, property);
        if (LAYOUT_TYPES.includes(item.name)) {
          const o = { componentName: item.name, children: [] };
          defination.push(o);
        } else if (BASIC_FORM_TYPES.includes(item.name)) {
          const o = defination[defination.length - 1];
          if (item.name === 'Input' && item.type === 'number') {
            item.name = 'InputNumber';
          }
          let obj = {
            componentName: getComName(item.name),
            key: property,
            label: item.title,
            placeholder: item.description,
            default: item.default,
            rules: [
              { type: item.type, message: 'type invalid' },
              { required: (item.required || []).includes(property), message: 'required' }
            ]
          };
          if (item.pattern) {
            obj.rules.push({ pattern: item.pattern, message: 'pattern invalid' });
          }
          if (item.name === 'Select') {
            obj.options = item.enum;
          }
          o.children.push(obj);
        }
        if (item.properties) {
          _parse(item);
        }
      });
    }
  }
  _parse(schema);
  return { defination, model: parseModel(schema) };
}

function parseModel(schema) {
  const model = {};
  _forEach(schema.properties, (item, property) => {
    if (item.type === 'string') {
      model[property] = item.default || '';
    } else if (item.type === 'number') {
      model[property] = item.default || null;
    } else {
      model[property] = null;
    }
  });
  return model;
}

// 解析为属性面板需要的格式
function parseAttr(schema) {}

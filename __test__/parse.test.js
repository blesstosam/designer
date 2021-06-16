import { expect, test } from '@jest/globals';
import { parse } from '../src/parse';

test('Parse schema by recursive', () => {
  const schema = {
    title: '基础表单',
    description: '一个基础表单',
    type: 'object',
    properties: {
      _firstrow: {
        name: 'grid-layout',
        type: 'object',
        properties: {
          username: {
            name: 'Input', // => 组件名称 在 vue 里指注册到vue上的组件 Vue.component('Input', { })
            type: 'string',
            title: '姓名', // => label
            description: '请填写姓名' // => placeholder
          },
          phone: {
            name: 'Input',
            type: 'string',
            title: '手机',
            description: '请填写手机',
            pattern: '^1[3578]\\d{9}$'
          },
          required: ['username']
        }
      },
      _secondrow: {
        name: 'grid-layout',
        type: 'object',
        properties: {
          gender: {
            name: 'Select',
            type: 'string',
            title: '性别',
            default: '男',
            description: '请选择性别',
            enum: ['男', '女']
          }
        }
      }
    }
  };

  const { defination } = parse(schema);
  // console.log(defination[0].children[0].rules)
  expect(defination[0].componentName).toBe('grid-layout');
  expect(defination[0].children).toHaveLength(2);
  expect(defination[0].children[0].componentName).toBe('v-input');
  expect(defination[0].children[0].rules).toHaveLength(2);
  expect(defination[0].children[1].componentName).toBe('v-input');
  expect(defination[0].children[1].rules).toHaveLength(3);

  expect(defination[1].componentName).toBe('grid-layout');
  expect(defination[1].children).toHaveLength(1);
  expect(defination[1].children[0].componentName).toBe('v-select');
});

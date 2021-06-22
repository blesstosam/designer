<template>
  <div>
    <!-- <GridLayout :schema="schema" /> -->
    <Tree />
  </div>
</template>

<script>
import GridLayout from './GridLayout.vue';
import Tree from './Tree';
export default {
  name: 'App',
  components: {
    GridLayout,
    Tree
  },
  data() {
    return {
      schema: {
        title: '基础表单',
        description: '一个基础表单',
        type: 'object',
        properties: {
          layout1: {
            // grid-layout 使用 <el-row> 和 <el-col> 实现
            name: 'grid-layout',
            type: 'object',
            // layout 相关的属性
            // 可以定义在 布局组件里 也可以定义在ui组件里
            layout_props: {
              layout_type: 'grid',
              span: 12,
              offset: 0
            },
            required: ['username', 'gender'],
            properties: {
              username: {
                name: 'Input', // => 组件名称 在 vue 里指注册到vue上的组件 Vue.component('Input', { })
                type: 'string',
                title: '姓名', // => label
                description: '请填写姓名', // => placeholder
                layout_props: {
                  span: 6,
                  offset: 0
                }
              },
              phone: {
                name: 'Input',
                type: 'string',
                title: '手机',
                description: '请填写手机',
                pattern: '^1[3578]\\d{9}$',
                layout_props: {
                  span: 6,
                  offset: 0
                }
              },
              gender: {
                name: 'Select',
                type: 'string',
                title: '性别',
                default: '男',
                description: '请选择性别',
                enum: ['男', '女'],
                layout_props: {
                  span: 6,
                  offset: 0
                }
              }
            }
          }
        }
      }
    };
  }
};
</script>

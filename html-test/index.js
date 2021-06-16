import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-chalk/index.css';

import VSelect from '../src/components/VSelect.vue';
import VInput from '../src/components/VInput.vue';
Vue.component('VSelect', VSelect);
Vue.component('VInput', VInput);

new Vue({
  el: '#app',
  render: (h) => h(App),
});

// 完美的 schema 描述
const schema = {
  type: 'object',
  properties: {
    // property 的 key 为 ${type}_${id}
    string_123: {
      // ui_name 为渲染的ui组件名称
      ui_name: 'Input',
      type: 'string',
      title: '',
      description: '',
      default: '1',

      // 描述ui组件需要的参数
      // 是否可以解析该参数为属性面板
      ui_props: {
        type: 'object',
        properties: {
          width: {
            type: 'string',
            default: '100%',
          },
        },
      },

      // ui的属性面板
      ui_attrs: {},

      // ui的样式面板 一部分是公共的 一部分是各组件特有的 合并而来
      ui_styles: {
        type: 'object',
        properties: {
          font: {
            type: 'object',
            properties: {
              size: {
                type: 'string',
              },
              color: {
                type: 'string',
              },
              family: {
                type: 'string',
              },
              opacity: {
                type: 'string',
              },
            },
          },
          border: {
            radius: {
              type: 'string',
            },
            width: {
              type: 'string',
            },
            shadow: {
              type: 'string',
            },
          },
          background: {
            color: {
              type: 'string',
            },
            opacity: {
              type: 'string',
            },
          },
          margin: {
            type: 'string',
          },
        },
      },

      // 事件描版
      ui_events: {
        
      }
    },
  },
};

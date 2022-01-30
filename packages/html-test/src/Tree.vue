<template>
  <el-row id="wrap">
    <!-- <tree-item :item="tree">{{ tree.value }}</tree-item> -->
  </el-row>
</template>

<script>
import TreeItem from './TreeItem';
export default {
  name: 'Tree',
  components: {
    TreeItem
  },
  mounted() {
    this.append(document.querySelector('#wrap'), this.tree)
  },
  data() {
    return {
      tree: {
        // 对于布局组件是没有value的 即没有content
        span: 12,
        offset: 0,
        bg: '#ddd',
        children: [
          {
            value: '1-1',
            span: 12,
            offset: 6,
            bg: '#ccc',
            children: [
              { value: '1-1-1', bg: '#bbb' },
              { value: '1-1-2', bg: '#aaa' }
            ]
          },
          { value: '1-2', span: 6, offset: 0, bg: '#999', children: [] }
        ]
      }
    };
  },
  methods: {
    append(wrap, data) {
      const div = document.createElement('div');
      div.textContent = data.value || '';
      div.style.backgroundColor = data.bg;
      wrap.appendChild(div);
      if (data.children && data.children.length) {
        data.children.forEach((item, index) => {
          this.append(div, item);
        });
      }
    }
  }
};
</script>

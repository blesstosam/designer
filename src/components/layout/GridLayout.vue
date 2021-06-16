<template>
  <div>
    <h1>layout</h1>
    <!-- <div v-for="(com, index) in defination" :key="index">
      <component :is="com.componentName" :param="com" v-model="model[com.key]"> </component>
    </div> -->
    <el-row>
      <el-col :span="12" :offset="6" style="background-color: lightgray; height: 200px">
        <el-row>
          <el-col :span="12" :offset="12" style="background-color: yellow; height: 100px">
            <el-row>
              <el-col :span="6" style="background-color: lightblue; height: 50px"></el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { parse } from '../../parse';
export default {
  // 需要递归调用自己
  name: 'GridLayout',
  // 通过 element-ui 的 删格布局来实现组件的布局
  // element-ui 删格布局的嵌套 => 这样可以实现树型嵌套布局
  props: {
    schema: {
      type: Object,
    },
  },
  data() {
    return {
      defination: [],
      model: {},
    };
  },
  created() {
    const { defination, model } = parse(this.schema);
    this.defination = defination;
    this.model = model;
    console.log(this.defination, this.model);
  },
};
</script>

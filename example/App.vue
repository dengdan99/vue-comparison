<template>
  <div id="app">
    <comparison
    :data = "mockData"
    :contrast = "contrast"
    :props = "compProps"
    @add-item = "addItemHander"
    >
      <div slot="symbol">
        <span class="tp-icon">- 无</span>
        <span class="tp-icon">&#xe63f; 选配</span>
        <span class="tp-icon">&#xe668; 标配</span>
      </div>
    </comparison>
  </div>
</template>

<script>
import Comparison from '../src/components/Comparison.vue'
import { data as mockData } from './mock-data'

export default {
  name: 'app',
  components: {
    Comparison
  },
  data () {
    return {
      // 测试数据
      mockData,

      // 关键props 的设置 (key 必须保持唯一)
      compProps: {
        name: 'name',
        key: 'id'
      },
      // 对比分组信息
      contrast: [{
        name: '外形',
        keys: {
          con_1: '排量',
          con_2: '外形尺寸'
        }
      }, {
        name: '动力',
        keys: {
          con_3: '轴距',
          con_4: '排挡',
          con_5: '其他'
        }
      }, {
        name: '分组名称1',
        keys: {
          con_6: '排量',
          con_7: '对比项7',
          con_8: '对比项8',
          con_9: '对比项9',
          con_10: '对比项10',
          con_11: '对比项11',
          con_12: '对比项12'
        }
      }, {
        name: '分组名称2',
        keys: {
          con_6: '对比项13',
          con_7: '对比项14',
          con_8: '对比项15',
          con_9: '对比项16',
          con_10: '对比项17',
          con_11: '对比项18',
          con_12: '对比项19'
        }
      }],

      // 新的一个对比数据
      newItem: {
        id: 1321,
        name: '新车对比',
        con_1: '6.0Td',
        con_2: '1520*1524*355d',
        con_3: '3362mmq',
        con_4: '自动挡w',
        con_5: '6.0Te',
        con_6: '1520*1524*355z',
        con_7: '3362mmx',
        con_8: '自动挡c',
        con_9: '6.0Tq',
        con_10: '1520*1524*355w',
        con_11: '3362mme',
        con_12: '自动挡r',
        con_13: '6.0Ta',
        con_14: '1520*1524*355x',
        con_15: '3362mmc',
        con_16: '自动挡z'
      }
    }
  },
  mounted () {
  },
  methods: {
    addItemHander () {
      // 添加一个新的对比数据
      this.mockData.push(this.newItem)
    }
  }
}
</script>

<style>
html{
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 12px;
}
html,body {
  padding: 0;
  margin: 0;
}
#app {
  height: 100%;
}
</style>

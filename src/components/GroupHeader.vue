<template>
  <div>
    <strong>{{title}}</strong>
    <div class="markup">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GroupHeader',
  props: {
    title: String
  },
  components: {
  },

  watch: {
  },
  computed: {
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped lang="less">
strong{
    margin-left: 0.5rem
}
.markup{
  position: absolute;
  right: 0.5rem;
  top: 0;
  font-size: 0.75rem;
  .tp-icon{
    float: right;
    margin-left: 10px;
  }
}
</style>


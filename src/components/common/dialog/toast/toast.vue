<template>
  <div class="alerts" v-if="show">
    <div class="dialog toasts">
      {{title || '来呗'}}
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      show: false,
      title: '来呗'
    }
  },
  methods: {
  }
}
</script>

<template>
  <base-btn
    :symbol="button.symbol"
    :value="button.value"
    v-on:button-up="button.upAction"
    v-on:button-down="button.downAction"
  />
</template>
<script>
import BaseBtn from './BaseBtn'

export default {
  components: { BaseBtn },
  props: {
    button: {
      type: Object,
      default: () => { return {} }
    }
  }
}
</script>

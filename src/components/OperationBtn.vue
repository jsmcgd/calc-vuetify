<template>
  <action-btn :button="button" class="font-bold" v-on:button-up="log('up')"></action-btn>
</template>
<script>
import ActionBtn from './ActionBtn'
import ButtonClasses from '../mixins/button-classes'

export default {
  mixins: [ButtonClasses],
  components: { ActionBtn },
  props: ['button']
}
</script>

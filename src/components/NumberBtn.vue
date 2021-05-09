<template>
  <action-btn :button="button" class="bg-gray-800"/>
</template>
<script>
import ActionBtn from './ActionBtn'
import ButtonClasses from '../mixins/button-classes'

export default {
  mixins: [ButtonClasses],
  inheritAttrs: false,
  components: { ActionBtn },
  props: ['button'
    // ,'buttonClasses'
  ] //,
  // provide: function () {
  //   return {
  //     extraButtonClasses: this.buttonClasses
  //   }
  // }
}
</script>

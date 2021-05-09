<template>
  <div class="base-button-container">
    <v-btn
      block
      dark
      class="
      pa-4
      convex
      "
      v-bind="$attrs"
      :class="[{'button-down': pressed}, additionalButtonClasses]"
      :value="value"
      @mousedown="downHandler"
      @mouseup="upHandler"
      v-html="symbol"
    />
  </div>
</template>
<script>

export default {
  inheritAttrs: false,
  props: {
    symbol: {
      default: '',
      type: String
    },
    value: {
      default: '',
      type: String
    }
  },
  inject: ['additionalButtonClasses'],
  data () {
    return { pressed: false }
  },

  methods: {
    downHandler: function (event) {
      this.pressed = true
      this.$emit('button-down', event.target.value)
    },
    upHandler: function (event) {
      this.pressed = false
      this.$emit('button-up', event.target.value)
    }
  }
}
</script>
<style lang="sass">
@import '~vuetify/src/styles/styles.sass'

.base-button-container
  height: 0
  padding-bottom: 85%
  position: relative
  display: block

.base-button-container > button[type=button].v-btn
  height: 100%
  top: 0px
  bottom: 0px
  position: absolute
  left: 0px
  right: 0px
  font-size: 2em
  text-shadow: 1px 1px 1px rgba(255,255,255,0.4), -1px -1px 1px rgba(0,0,0,0.2)

  @media #{map-get($display-breakpoints, 'sm-and-up')}
    font-size: 3em

</style>

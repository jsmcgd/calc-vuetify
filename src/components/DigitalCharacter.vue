<template>
  <svg class="character" viewBox="0,0,100,200" >
    <polyline
      v-for="(segment, index) in segments"
      :id="'seg'+index"
      :key="index"
      :class="['segment', segment.on ? 'on' : 'off', segment.class]"
      :points="segment.points"/>
  </svg>
</template>
<style>
.character {
  margin: 2px;
}
.character {
  fill: black;
}
.segment.on {
  opacity: 0.75;
}
.segment.off {
  opacity: 0.05;
}
.segment.off.period {
  opacity: 0;
}
</style>
<script>
export default {
  props: ['character', 'on'],
  computed: {
    segments: function () {
      let config = null
      const character = (this.on) ? '' + this.character : ''
      switch (character) {
        case '': config = [false, false, false, false, false, false, false, false]; break
        case ' ': config = [false, false, false, false, false, false, false, false]; break
        case '0': config = [true, true, true, false, true, true, true, false]; break
        case '1': config = [false, false, true, false, false, false, true, false]; break
        case '2': config = [false, true, true, true, true, true, false, false]; break
        case '3': config = [false, true, true, true, false, true, true, false]; break
        case '4': config = [true, false, true, true, false, false, true, false]; break
        case '5': config = [true, true, false, true, false, true, true, false]; break
        case '6': config = [true, false, false, true, true, true, true, false]; break
        case '7': config = [false, true, true, false, false, false, true, false]; break
        case '8': config = [true, true, true, true, true, true, true, false]; break
        case '9': config = [true, true, true, true, false, false, true, false]; break
        case '.': config = [false, false, false, false, false, false, false, true]; break
        case '-': config = [false, false, false, true, false, false, false, false]; break
        case 'E': config = [true, true, false, true, true, true, false, false]; break
        case 'r': config = [false, false, false, true, true, false, false, false]; break
        default: config = [true, true, true, true, true, true, true]; break
      }
      config = config.map((x) => { return { on: x } })

      const points = [
        { points: '0,0 0,100 25,85 25,25 0,0' },
        { points: '0,0 100,0 75,25 25,25 0,0' },
        { points: '100,0 100,100 75,85 75,25' },
        { points: '0,100 25,85 75,85 100,100 75,115 25,115 0,100' },
        { points: '0,100 0,200 25,175 25,115 0,100' },
        { points: '0,200 100,200 75,175 25,175 0,200' },
        { points: '100,100 100,200 75,175 75,115' },
        { points: '40,175 60,175 60,200 40,200', class: 'period' }
      ]

      return config.map((o, i) => {
        return Object.assign({}, o, points[i])
      })
    }
  }
}
</script>

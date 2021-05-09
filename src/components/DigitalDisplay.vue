<style>
  .digital-display {
    border: 1px solid grey;
    background-color: #7E8A79;
  }
  .character-container {
  }
</style>
<script>
import DigitalCharacter from './DigitalCharacter'

export default {
  components: {
    DigitalCharacter // ,
    // VContainer
  },
  props: {
    text: {
      type: String,
      default: ''
    },
    on: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    paddedText: function () {
      return this.text.padStart(10, ' ')
    }
  }
}
</script>
<template>
  <v-container class="">
    <v-col class="digital-display  concave rounded pa-1 pa-sm-2 pa-md-3 pa-lg-4">
      <div class="character-container d-flex">
        <v-col
          v-for="(character, index) in paddedText"
          :key="index"
          class="pa-1"
        >
          <digital-character
            :character="character"
            :on="on"
            ></digital-character>
        </v-col>
      </div>
    </v-col>
  </v-container>
</template>

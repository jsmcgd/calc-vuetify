<template>
  <div class="m-1 m:m-2">
    <div
      class="concave flex inflate justify-content-flex-end
            overflow-hidden p-4 rounded-lg shadow-inner
            text-right w-full"
      id="display"
      v-html="text"
    >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>

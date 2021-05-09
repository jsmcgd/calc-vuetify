export default {
  props: ['buttonClasses'],
  provide: function () {
    return {
      additionalButtonClasses: this.buttonClasses
    }
  }
}

<template lang="pug">
  v-app(:class="{'Mobile': winSize.mobile, 'Tablet': winSize.tablet, 'Desktop': winSize.desktop}" v-if="globalLoading")
    router-view
    Notify(:mobile="winSize.mobile")
</template>
<script>
  import Notify from '@/components/Notify'

  export default {
    components: {
      Notify,
    },
    computed: {
      globalLoading(){return !this.$store.getters.globalLoading},
      winSize() {return this.$store.getters.winSize}
    },
    created() {
      window.addEventListener('resize', this.handleResize);
      this.handleResize();
    },
    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    },
    methods: {
      handleResize() {
        this.$store.dispatch('winSize', {
          width: window.innerWidth,
          height: window.innerHeight
        });
      }
    }
  }
</script>
<style lang="scss">
  @import "assets/sass/variable";
  @import "assets/sass/mixin";
  @import "assets/sass/global";
  body, html {
    min-height: 100vh;
    overflow-y: auto !important;
  }
</style>

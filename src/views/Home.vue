<template lang="pug">
    .home
        .home__content Home
</template>

<script>
    export default {
        name: 'Home',
        components: {
        },
        data: () => ({
            tabs: 'tab-1',
        }),
        computed: {
            mobile() {return this.$store.getters.winSize.mobile},
        }
    }
</script>

<style scoped lang='sass'>
.home
    display: flex
    min-height: 100vh
    width: 100vw
    justify-content: center
    align-items: center
.home__content
</style>

<template lang="pug">
    div
        h1 skfskjhfksjdhdjhd
        router-view
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
</style>

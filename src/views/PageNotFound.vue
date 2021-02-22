<template lang="pug">
    .wrapper
        h1 {{message}}
</template>

<script>
    export default {
        name: 'PageNotFound',
        data() {
            return {
                message: 'WTF Bro!? There is nothing here.'
            }
        }
    }
</script>

<style scoped lang="sass">
.wrapper
    height: 100%
    display: flex
    justify-content: center
    align-items: center
</style>

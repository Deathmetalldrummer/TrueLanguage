<template lang="pug">
    v-fab-transition
        router-link( to="/settings")
            v-btn(color='default' fab ).fab
                font-awesome-icon(icon="cog" size="2x")
</template>

<script>
    export default {
        name: 'Fab',
        data() {
            return {
                message: 'Слава Одину, Fab работает!'
            }
        }
    }
</script>

<style scoped lang="sass">
    .fab
        bottom: 1em
        left: 1em
        position: fixed
</style>

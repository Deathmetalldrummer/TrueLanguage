<template lang="pug">
    v-fab-transition
        router-link(:to="routerLink")
            v-btn(color='default' fab ).fab
                font-awesome-icon(:icon="routerIcon" size="2x")
</template>

<script>
    export default {
        name: 'Fab',
        data() {
            return {
                message: 'Слава Одину, Fab работает!'
            }
        },
        computed: {
            currentRouteName() {
                return this.$route.name;
            },
            routerLink() {
                return this.currentRouteName === 'Settings' ? '/' : '/settings'
            },
            routerIcon() {
                return this.currentRouteName === 'Settings' ? 'home' : 'cog'
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

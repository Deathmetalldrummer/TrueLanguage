<template lang="pug">
    v-speed-dial(:open-on-hover='true')
        template(v-slot:activator)
            router-link(:to="routerLink")
                v-btn(color='default' fab)
                    font-awesome-icon(:icon="routerIcon" size="2x")
        router-link(:to="routerDeleteLink")
            v-btn(color='default' fab small)
                font-awesome-icon(:icon="routerDeleteIcon" size="2x")
        //router-link(to="/edit")
            v-btn(color='default' fab small)
                font-awesome-icon(icon="pencil-alt" size="2x")

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
            },
            routerDeleteLink() {
                return this.currentRouteName === 'Trash' ? '/' : '/trash'
            },
            routerDeleteIcon() {
                return this.currentRouteName === 'Trash' ? 'home' : 'trash'
            }
        }
    }
</script>

<style scoped lang="sass">
</style>

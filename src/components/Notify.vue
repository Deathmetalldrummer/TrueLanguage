<template lang="pug">
    .notify
        transition-group(name="notifyListAnimate" tag="div")
            .notify__.notifyItemAnimate(v-for="item in notify" :key="item.id")
                v-alert(v-if="mobile" :color="colorByType(item.type)" dark elevation="8").notify__alert {{item.body}}
                    v-btn(icon @click="notifyClose(item.id)").notify__close
                        v-icon mdi-close
                v-alert(v-else :type="item.type" prominent dense elevation="8").notify__alert {{item.body}}
                    v-btn(icon @click="notifyClose(item.id)").notify__close
                        v-icon mdi-close
</template>
<script>
    export default {
        name: 'Notify',
        props: ['mobile'],
        data() {
            return {
                message: 'Слава Одину, Notify работает!'
            }
        },
        computed: {
            notify() {
                return this.$store.getters.notify
            }
        },
        methods: {
            notifyClose(id) {
                this.$store.dispatch('notifyDel', id)
            },
            colorByType(type) {
                switch (type) {
                    case 'success':
                        return 'green'
                    case 'info':
                        return 'blue'
                    case 'warning':
                        return 'orange darken-1'
                    case 'error':
                        return 'red accent-2'
                }
            }
        }
    }
</script>

<style scoped lang="sass">
@import '../assets/sass/variable'

.notify
    position: fixed
    right: 1em
    top: 1em
    width: 25em
    max-width: calc(100% - 2em)
    z-index: 999
.notify__
    width: 100%
.notify__alert
    position: relative
    padding-right: 3em
.notify__close
    position: absolute
    right: -6px
    top: -6px
.notifyItemAnimate
    transition: all 0.5s

.notifyListAnimate-enter, .notifyListAnimate-leave-to
    opacity: 0
    transform: translateY(-10em)

.notifyListAnimate-leave-active
    position: absolute
</style>

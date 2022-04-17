<template lang="pug">
    div
        router-view
        Fab.fab
</template>

<script>
    import Fab from '@/components/Fab'

    export default {
            name: 'Main',
             components: {
                 Fab
             },
            data() {
                return {
                    message: 'Слава Одину, Main работает!'
                }
            }
        }
</script>

<style scoped lang='sass'>
.fab
    bottom: 1em
    left: 1em
    position: fixed
</style>

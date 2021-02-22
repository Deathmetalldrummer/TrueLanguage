<template lang="pug">
    .settings
        .settings__content settings
</template>

<script>
     export default {
            name: 'Settings',
            data() {
                return {
                    message: 'Слава Одину, Settings работает!'
                }
            }
        }
</script>

<style scoped lang='sass'>
.settings
    display: flex
    min-height: 100vh
    width: 100vw
    justify-content: center
    align-items: center
.settings__content
</style>

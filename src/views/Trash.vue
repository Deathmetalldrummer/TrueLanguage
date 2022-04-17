<template lang="pug">
    .wrapper
        .main
            ol.main__list
                li(v-for="item of list" :key="item.key" v-if="item").main__item
                    span.main__itemText
                        span.main__itemText_index {{item.key}}
                        span.main__itemText_postIndex -
                        span.main__itemText_left {{item.value.source || ''}}
                        span.main__itemText_center -
                        span.main__itemText_right {{item.value.target || ''}}
                    .main__itemControls
                        .btn_icon(@click="onDelete(item.key)")
                            Icons(name='del').icon
</template>

<script>
    import { Quest } from '../components/Quest';
    import Icons from '../components/Icons';
    export default {
        name: 'Trash',
        components: {
            Icons
        },
        data() {
            return {
                quest: new Quest(),
            }
        },
        computed: {
            list() { return this.data.filter(item =>
                this.dataDelete.indexOf(item.key) !== -1
            )},
            lang() { return this.$store.getters.settings && this.$store.getters.settings.source.value },
            data() { return this.$store.getters.data(this.currentLang)},
            dataDelete() { return this.$store.getters.dataDelete(this.currentLang)},
        },
        methods: {
            onDelete(id) {
                const quest = this.quest.get();
                const res = prompt(quest.value);
                if (res === quest.res) {
                    this.$store.dispatch('deleteFromTrash', id);
                } else {
                    alert("Sorry, it's wrong((")
                }
            }
        },
        mounted() {
            this.$store.dispatch('currentLang', this.lang);
            this.$store.dispatch('dataInit');
        },
    }
</script>

<style scoped lang="sass">
.btn_icon
    padding: 0.5em
    border: 1px solid #ccc
    border-radius: 50%
    display: inline-flex
    vertical-align: middle
    width: 2em
    height: 2em
    justify-content: center
    align-items: center
    cursor: pointer
    .icon
        width: 100%
        max-height: 100%

.langToggle
    display: flex
    justify-content: flex-end
    align-items: center
    &__content
        margin-right: 2em
    &__additional
.langControl
    margin-bottom: 1em
    display: flex
    justify-content: flex-start
    align-items: center
    &__source
        padding-left: 3.4em
        width: 47%
    &__target
        width: 53%
.wrapper
    display: flex
    justify-content: stretch
    align-items: stretch
.menu
    width: 20%
    flex-shrink: 0
    text-align: left
    background-color: #303030
    border-top: 1px solid #504e4e
    transition-duration: 0.5s
    transition-property: left
    padding: 0.6em 0
    &__link
        text-decoration: none
        display: block
        padding: 5px 10px
        color: #868686
        position: relative
        transition-duration: 0.4s
        border-left: 5px solid transparent
        &:hover
            background-color: #fff
        &_active
            background-color: #fff
            border-left-color: #ff6b00
    &__list
        list-style: none
        padding-left: 0
        border-left: 1px solid #ccc
.main
    flex-grow: 1
    margin: 0 2em 0 4em
    &__item
        display: flex
        flex-flow: row wrap
        &:hover &Controls
            opacity: 1
            z-index: 9
        &Text
            display: flex
            flex-grow: 1
            cursor: pointer
            &_index
            &_postIndex
                padding: 0 0.5em
            &_left
                width: 40%
                flex-grow: 1
                span
                    display: inline-block
                    width: 100%
                    height: 100%
            &_center
                padding: 0 0.5em
            &_right
                width: 50%
                flex-grow: 1
                span
                    display: inline-block
                    width: 100%
                    height: 100%
        &Controls
            transition-duration: 0.3s
            position: relative
            z-index: -1
            opacity: 0
            flex-shrink: 0
        &Description
            width: 100%
            flex-grow: 1
            .descriptionAdditional
                padding-left: 44%
            .descriptionContent
                border: 1px dashed #d8d8d8
                border-radius: 0.3em
                min-height: 1.7em
                &_hide
                    height: 0
                    min-height: 0
                    max-height: 0
                    opacity: 0
        &+&
            border-top: 1px solid #ccc
*[contenteditable='true']
    border: 1px solid #ccc
    border-radius: 0.2em
    cursor: text
</style>

<template lang="pug">
    .wrapper
        .main
            .langToggle
                span.langToggle__content
                    v-switch(v-model='contentShow' label='Toggle' color='red' hide-detail)
                span.langToggle__additional
                    v-switch(v-model='additionalShow' label='Additional' color='orange darken-3' hide-detail)
            .langControl
                span.langControl__source
                    v-switch(v-model='langSourceShow' :label='lang.toUpperCase()' color='primary' hide-detail)
                span.langControl__target
                    v-switch(v-model='langTargetShow' :label='langTarget.toUpperCase()' color='success' hide-detail)
            ol.main__list
                li(v-for="item of list(mainData.get(route))" :key="item.key" v-if="item").main__item
                    span.main__itemText(@click="openDescription(item.key, item)")
                        span.main__itemText_index {{item.key}}
                        span.main__itemText_postIndex -
                        span.main__itemText_left
                            span(v-show="langSourceShow"
                                :contenteditable="edit === item.key"
                                :ref="'source' + item.key"
                                @click="edit === item.key && $event.stopPropagation()"
                                @input="itemEditing.value.source = $event.target.innerText")
                                | {{langSourceShow && item.value.source || ''}}
                        span.main__itemText_center -
                        span.main__itemText_right
                            span(v-show="langTargetShow"
                                :contenteditable="edit === item.key"
                                :ref="'target' + item.key"
                                @click="edit === item.key && $event.stopPropagation()"
                                @input="itemEditing.value.target = $event.target.innerText")
                                | {{item.value.target || ''}}
                    .main__itemControls
                        template(v-if='edit === item.key')
                            .btn_icon(@click="onSuccessEdit(item)")
                                Icons(name='check').icon
                            .btn_icon(@click="onCancelEdit(item)")
                                Icons(name='close').icon
                        template(v-else)
                            .btn_icon(@click="onEdit(item)")
                                Icons(name='edit').icon
                            .btn_icon(@click="onDelete(item.key)")
                                Icons(name='del').icon
                    .main__itemDescription(v-if="openedDescription.indexOf(item.key) !== -1")
                        .descriptionAdditional(
                            v-if="item.value.other && additionalShow && langTargetShow"
                            :contenteditable="edit === item.key && false"
                            :ref="'other' + item.key"
                            @input="itemEditing.value.other.additional.target = $event.target.innerText")
                            | {{item.value.other.additional && item.value.other.additional.target}}
                        .descriptionContent(
                            :class="{'descriptionContent_hide': !contentShow}"
                            v-html="item.value.html"
                            :contenteditable="edit === item.key"
                            :ref="'html' + item.key"
                            @input="itemEditing.value.html = $event.target.innerHTML")
        nav.menu
            ul.menu__list
                li(v-for="item of day").menu__item
                    router-link(tag='a' :to="{ path: '/list/' + item, query: {words, lang} }" active-class="menu__link_active").menu__link day {{item}}
</template>

<script>
    import { Quest } from '../components/Quest';
    import store from '../store/index.js';
    import Icons from '../components/Icons';
    export default {
            name: 'List',
            components: {
                Icons
            },
            data() {
                return {
                    quest: new Quest(),
                    edit: false,
                    openedDescription: [],
                    contentShow: true,
                    additionalShow: false,
                    langTargetShow: true,
                    langSourceShow: true,
                    itemEditing: null,
                    message: 'Слава Одину, List работает!',
                    throttling: null
                }
            },
            computed: {
                currentLang() { return this.$store.getters.currentLang },
                route() { return +this.$route.params.id || null},
                queryWords() { return +this.$route.query.words || null},
                queryLang() { return +this.$route.query.lang || null},
                words() { return this.$store.getters.settings.words },
                lang() { return this.$store.getters.settings.source.value },
                langTarget() { return this.$store.getters.settings.target.value },
                data() { return this.$store.getters.data(this.currentLang) || [] },
                dataDelete() { return this.$store.getters.dataDelete(this.currentLang) || [] },
                dataEdit() { return this.$store.getters.dataEdit(this.currentLang) || [] },
                day() {
                    const residue = this.data.length % +this.words;
                    const count = (this.data.length - residue) / +this.words;
                    return residue ? count + 1 : count;
                },
                mainData() {
                    const xMap = new Map();
                    for (let i = 0; i < this.day; i++) {
                        xMap.set(i + 1, this.data.slice(i * +this.words, i * +this.words + +this.words))
                    }
                    return xMap;
                },
            },
            methods: {
                onEdit(item) {
                    this.itemEditing = JSON.parse(JSON.stringify(item));
                    this.edit = item.key;
                },
                onSuccessEdit() {
                    const quest = this.quest.get();
                    const res = prompt(quest.value);
                    if (res === quest.res) {
                        this.$store.dispatch('dataEdit', {id: this.lang, payload: this.itemEditing});
                    }
                    this.itemEditing = null;
                    this.edit = false;
                },
                onCancelEdit(item) {
                    // TODO: can i use innerText
                    this.$refs['source' + item.key][0].innerText = item.value.source;
                    this.$refs['target' + item.key][0].innerText = item.value.target;
                    // this.$refs['other' + item.key][0].innerText = item.value.other && item.value.other.additional.target;

                    if (this.$refs['html' + item.key] && this.$refs['html' + item.key].length) {
                        this.$refs['html' + item.key][0].innerHTML = item.value.html;
                    }
                    this.itemEditing = null;
                    this.edit = false;
                },
                onDelete(item) {
                    const quest = this.quest.get();
                    const res = prompt(quest.value);
                    if (res === quest.res) {
                        this.$store.dispatch('dataDelete', {id:  this.lang, payload: item});
                    }
                },
                list(list) {
                    return list.map(item => (item && this.dataDelete.indexOf(item.key) === -1) ? item : null)
                        .filter(item => item)
                        .map(item => this.dataEdit.find(dataItem => dataItem.key === item.key) || item);
                },
                openDescription(value) {
                    const index = this.openedDescription.indexOf(value);
                    if (index === -1) {
                        this.openedDescription.push(value)
                    } else {
                        this.openedDescription.splice(index, 1);
                    }
                },
                onInput(x1, x2, $event) {
                    $event.stopPropagation();
                    $event.preventDefault();
                    x1 = x2;
                }
            },
            beforeCreate() {
                store.dispatch('dataInit');
            },
            beforeRouteEnter (to, from, next) {
                const $words = store.getters.settings.words;
                const $lang = store.getters.settings.source.value;
                const currentLang = store.getters.currentLang;
                const {words, lang} = to.query;
                const query = words && lang;
                const condition = query && ($words !== words || $lang !== lang);
                if (!currentLang || currentLang !== $lang) {
                    store.dispatch('currentLang', condition ? lang : $lang);
                }
                if (condition) {
                    const _to = {
                        ...to,
                        name: condition ? 'SavedList' : 'List'
                    };
                    next(_to);
                } else {
                    next();
                }
            },
     }
</script>

<style scoped lang='sass'>
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

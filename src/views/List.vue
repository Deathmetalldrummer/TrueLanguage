<template lang="pug">
    .wrapper
        .main
            ol.main__list
                template(v-for="item of list(mainData.get(route))")
                    li(v-if="item").main__item {{item.key}} - {{item.value.source}} - {{item.value.target}}
                        br
                        v-btn(@click="onEdit(item)") edit
                        v-btn(@click="onDelete(item.key)") delete
        nav.menu
            ul.menu__list
                li(v-for="item of day").menu__item
                    router-link(tag='a' :to="{ path: '/list/' + item, query: {words, lang} }" active-class="menu__link_active").menu__link day {{item}}
</template>

<script>
    import store from '../store/index.js';
    export default {
            name: 'List',
            data() {
                return {
                    message: 'Слава Одину, List работает!'
                }
            },
            computed: {
                currentLang() { return this.$store.getters.currentLang },
                route() { return +this.$route.params.id || null},
                queryWords() { return +this.$route.query.words || null},
                queryLang() { return +this.$route.query.lang || null},
                words() { return this.$store.getters.settings.words },
                lang() { return this.$store.getters.settings.source.value },
                data() { return this.$store.getters.data(this.currentLang) || [] },
                dataDelete() { return this.$store.getters.dataDelete(this.currentLang) || [] },
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
                    this.$store.dispatch('dataEdit', {id: this.lang, payload: item});

                },
                onDelete(item) {
                    this.$store.dispatch('dataDelete', {id:  this.lang, payload: item});
                },
                list(list) {
                    return list.map(item => (item && this.dataDelete.indexOf(item.key) === -1) ? item : null)
                }
            },
            mounted() {
                console.log('route', this.$route.name);
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
.wrapper
    display: flex
    justify-content: stretch
    align-items: stretch
    padding: 2em 0
.menu
    width: 20%
    flex-shrink: 0
    &__link
        text-decoration: none
        display: block
        padding-left: 1em
        &:hover, &_active
            text-decoration: underline
    &__list
        list-style: none
        padding-left: 0
        border-left: 1px solid #ccc
.main
    flex-grow: 1
    margin-left: 6em
    &__item
        &+&
            border-top: 1px solid #ccc

</style>

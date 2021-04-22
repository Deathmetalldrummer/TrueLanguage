<template lang="pug">
    .settings
        .settings__content
            v-row
                v-col(cols='5')
                    v-subheader Количество слов в день
                v-col(cols='7')
                    v-text-field(:value="words" @input="onSave($event, 'words')" placeholder="100" solo)
            v-row
                v-col(cols='5')
                    v-subheader Язык частотного словаря
                v-col(cols='7')
                    v-select(:value='source' @change="onSave($event, 'source')" :items="langSource" item-text="name" item-value="value" item-disabled="disabled" return-object solo)
            v-row
                v-col(cols='5')
                    v-subheader Язык для перевода
                v-col(cols='7')
                    v-select(:value='target' @change="onSave($event, 'target')" :items="langTarget" item-text="name" item-value="value" item-disabled="disabled" return-object solo)
</template>

<script>
     export default {
            name: 'Settings',
            data() {
                return {
                    message: 'Слава Одину, Settings работает!',
                    langSource: [
                        { value: 'en', name: 'English' },
                        { value: 'ru', name: 'Russian', disabled: true},
                        { value: 'de', name: 'German' },
                    ],
                    langTarget: [
                        { value: 'en', name: 'English', disabled: true },
                        { value: 'ru', name: 'Russian' },
                        { value: 'de', name: 'German', disabled: true },
                    ],
                    save: {},
                }
            },
            computed: {
                settings() { return this.$store.getters.settings },
                source() { return this.settings && this.settings.source },
                target() { return this.settings && this.settings.target },
                words() { return this.settings && this.settings.words },
            },
            methods: {
                onSave($event, key) {
                    this.save[key] = $event;
                    this.$store.dispatch('settingsSave', {
                        ...this.settings,
                        ...this.save
                    });
                    if (key !== 'words') {
                        this.onDisabled(key, $event.value);
                    }
                },
                onDisabled(key, value) {
                    const list1 = ((key === 'source') && 'langTarget') || ((key === 'target') && 'langSource');
                    this[list1] = this[list1].map(item => {
                        delete item.disabled;
                        if (item.value === value) item.disabled = true;
                        return item
                    });
                }
            }
        }
</script>

<style scoped lang='sass'>
.settings
    display: flex
    min-height: 100vh
    justify-content: center
    align-items: center
.settings__content
</style>

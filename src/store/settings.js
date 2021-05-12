import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

const defaultSettings = {"source":{"value":"en","name":"English"},"target":{"value":"ru","name":"Russian"},"words":100};
const timeKey = 'TrueLanguageTime';
const settingsKey = 'TrueLanguageSettings';
export default {
    state: {
        settings: null,
    },
    getters: {
        settings: state=>state.settings,
    },
    mutations: {
        settings:(state,payload)=>{state.settings = payload},
    },
    actions: {
        settingsInit: (state) => {
            const _settings = JSON.parse(localStorage.getItem(settingsKey));
            if (_settings) {
                state.commit('settings', _settings);
            } else {
                state.dispatch('settingsLoad');
            }
        },
        settingsSave: (state, payload) => {
            if (checkTime()) {
                state.dispatch('settingsUpdate', payload)
            }
            state.dispatch('_settingsUpdate', payload)
        },
        settingsLoad: (state) => {
            firebase.firestore().collection('Users').doc(state.getters.user).get()
                .then(respond=>{
                    state.commit('settings',
                        respond.exists ? respond.data().settings : defaultSettings
                    );
                });
        },
        settingsUpdate: (state, settings) => {
            state.commit('settings', settings);
            const doc = firebase.firestore().collection('Users').doc(state.getters.user);
            doc.get().then(respond=>{
                if (respond.exists) {
                    doc.update({
                        settings
                    }).then(respond=>{
                        setTime();
                    }).catch(error=>{
                        console.error(error);
                    })
                }
            });
        },
        _settingsUpdate: (state, payload) => {
            state.commit('settings', payload);
            localStorage.setItem(settingsKey, JSON.stringify(payload));
        },
    },
}
function setTime() {
    localStorage.setItem(timeKey, (new Date()).getTime().toString());
}
function checkTime() {
    const time = localStorage.getItem(timeKey) || 0;
    const hour = 60 * 60 * 1000;
    const date = (new Date()).getTime();
    return (time + hour) < date;
}

import Vue from 'vue';
import Vuex from 'vuex';
import settings from './settings';
import loading from './loading';
import notify from './notify';
import store from './store';
import auth from './auth';
import firebase from 'firebase/app'
import 'firebase/firestore'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: {
      en: [],
      de: [],
    },
    currentLang: null,
    dataEdit: {
      en: [],
      de: []
    },
    dataDelete: {
      en: [],
      de: []
    },
  },
  getters: {
    data: state=>(id='en')=>state.data[id],
    currentLang: state=>state.currentLang,
    dataEdit: state=>(id='en')=>state.dataEdit[id],
    dataDelete: state=>(id='en')=>state.dataDelete[id],
  },
  mutations: {
    data:(state, {id, payload})=>{state.data[id] = payload},
    currentLang:(state,payload)=>{state.currentLang = payload},
    dataEdit:(state, {id, payload})=>{state.dataEdit[id] = payload},
    dataDelete:(state, {id, payload})=>{state.dataDelete[id] = payload},
    loadingFile:(state) => {
      fetch('../assets/deutsche.json')
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            state.data.de = data;
          });
      fetch('../assets/english.json')
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            state.data.en = data.collection;
          });
    }
  },
  actions: {
    currentLang:(state, payload=state.getters.settings.source.value)=>{
      switch (payload) {
        case 'en':
          state.commit('currentLang', 'en');
          console.log('currentLang EN');
          break;
        case 'de':
          state.commit('currentLang', 'de');
          console.log('currentLang DE');
          break;
      }
    },
    dataInit:(state) => {
      const collection = firebase.firestore()
          .collection('Users')
          .doc(state.getters.user)
          .collection('lang')
          .doc(state.getters.currentLang);
      const editCollection = collection
          .collection('edit');

        editCollection.get().then(respond => {
          state.commit('dataEdit', {
            id: state.getters.currentLang,
            payload: respond.docs.map(doc => doc.data())
          })
        }).catch((error) => {
          console.log("Error getting document:", error);
        });
        collection.get().then(respond=>{
          if (respond.exists && respond.data().delete) {
            state.commit('dataDelete', {
              id: state.getters.currentLang,
              payload: respond.data().delete || []});
          }
        }).catch((error) => {
          console.log("Error getting document:", error);
        });
    },
    dataEdit:(state, {id, payload})=>{
      let list = state.getters.dataEdit(id);
      const isHaveItem = list.filter(item=> item.key === payload.key).length;
      const editCollection = firebase.firestore()
              .collection('Users')
              .doc(state.getters.user)
              .collection('lang')
              .doc(id)
              .collection('edit')
              .doc(payload.key.toString());
      editCollection.get().then(respond=>{
        if (respond.exists) {
          editCollection.update(payload);
        } else {
          editCollection.set(payload);
        }
        if (isHaveItem) {
          list = list.map(item => item.key === payload.key ? payload : item);
          state.commit('dataEdit', {id, payload: list});
        } else {
          state.commit('dataEdit', {id, payload: [...list, payload]})
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },
    dataDelete:(state, {id, payload})=>{
      const deleteCollection = firebase.firestore()
          .collection('Users')
          .doc(state.getters.user)
          .collection('lang')
          .doc(id);

      deleteCollection.get().then(respond=>{
        const listDelete = state.getters.dataDelete(id);
        const listEdit = state.getters.dataEdit(id);
        const isHaveItemDelete = !listDelete.filter(item=> item === payload).length;
        const isHaveItemEdit = listEdit.filter(item=> item.key === payload).length;
        if (isHaveItemEdit) {
          state.commit('dataEdit', {id, payload: listEdit.filter(item=> item.key !== payload)});
        }
        if (respond.exists) {
          if (isHaveItemDelete) {
            deleteCollection.update({
              delete: [...listDelete, payload]
            });
            state.commit('dataDelete', {id, payload: [...listDelete, payload]});
          }
        } else {
          deleteCollection.set({
            delete: [payload]
          });
        }
      }).catch((error) => {
        console.log("Error getting document:", error);
      });
    },
    deleteFromTrash:(state, id)=>{
      const deleteCollection = firebase.firestore()
          .collection('Users')
          .doc(state.getters.user)
          .collection('lang')
          .doc(state.getters.currentLang);

      const payload = state.getters.dataDelete(state.getters.currentLang).filter(item => item !== id);

      deleteCollection.update({'delete': payload});
      state.commit('dataDelete', {
        id: state.getters.currentLang,
        payload
      })
    },
  },
  modules: {
    settings,
    loading,
    notify,
    store,
    auth
  }
});

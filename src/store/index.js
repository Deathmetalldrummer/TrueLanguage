import Vue from 'vue';
import Vuex from 'vuex';
import settings from './settings';
import loading from './loading';
import notify from './notify';
import store from './store';
import auth from './auth';
import en from '../assets/english';
import de from '../assets/deutsche';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    data: {
      en: en.collection,
      de,
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
  },
  actions: {
    currentLang:(state, payload=state.getters.settings.source.value)=>{
      console.log('payload', payload, state.getters.dataDelete.en);
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
    dataEdit:(state, {id, payload})=>{
      let list = state.getters.dataEdit(id);
      const isHaveItem = list.filter(item=> item.key === payload.key).length;
      if (isHaveItem) {
        list = list.map(item => item.key === payload.key ? payload : item);
        state.commit('dataEdit', {id, payload: list});
      } else {
        state.commit('dataEdit', {id, payload: [...list, payload]})
      }
    },
    dataDelete:(state, {id, payload})=>{
      const listDelete = state.getters.dataDelete(id);
      const listEdit = state.getters.dataEdit(id);
      const isHaveItemDelete = !listDelete.filter(item=> item === payload).length;
      const isHaveItemEdit = listEdit.filter(item=> item.key === payload).length;
      if (isHaveItemDelete) {
        state.commit('dataDelete', {id, payload: [...listDelete, payload]});
      }
      if (isHaveItemEdit) {
        state.commit('dataEdit', {id, payload: listEdit.filter(item=> item.key !== payload)});
      }
    }
  },
  modules: {
    settings,
    loading,
    notify,
    store,
    auth
  }
});

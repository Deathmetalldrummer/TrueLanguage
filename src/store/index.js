import Vue from 'vue';
import Vuex from 'vuex';
import settings from './settings';
import loading from './loading';
import notify from './notify';
import store from './store';
import auth from './auth';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    settings,
    loading,
    notify,
    store,
    auth
  }
});

import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index.js';
import PageNotFound from '@/views/PageNotFound';
import Settings from '@/views/Settings';
import Auth from "../views/Auth";
import Main from "@/views/Main";
import List from "@/views/List";
import SavedList from "@/views/SavedList";
import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Main,
    children: [
      {
        path: '',
        redirect: 'list/1',
        component: List,
      },
      {
        path: 'list/:id',
        name: 'List',
        component: List,
      },
      {
        path: 'list/:id',
        name: 'SavedList',
        component: SavedList,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
      },
    ],
    beforeEnter: authGuard
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    beforeEnter: (to, from, next) => {
      store.dispatch('globalLoading', false);
      next();
    }
  },
  {
    path: '/404',
    component: PageNotFound,
    beforeEnter: (to, from, next) => {
      store.dispatch('globalLoading', false);
      next();
    }
  },
  {
    path: '*',
    redirect: '/404'
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});
function authGuard(to, from, next) {
  function authError() {
    store.dispatch('isAuth', false);
    store.dispatch('user', null);
    store.dispatch('globalLoading', false);
    next({ name: 'Auth' });
  }
  function authSuccess(user) {
    store.dispatch('isAuth', true);
    store.dispatch('user', user.uid);
    store.dispatch('settingsInit');
    store.dispatch('globalLoading', false);
    next();
  }
  if (!window.firebaseAuthOnAuthStateChanged) {
    window.firebaseAuthOnAuthStateChanged = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        firebase.firestore().collection('Users').doc(user.uid).get().then(respond=>{
          if (to.name === 'Auth') {
            next({ name: 'Home' });
          }
          authSuccess(user);
        }).catch(error=>{
          store.dispatch('signOut');
        });
      } else {
        authError();
      }
    });
  } else {
    next();
  }
}
export default router

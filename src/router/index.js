import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store/index.js';
import PageNotFound from '@/views/PageNotFound';
import Home from '@/views/Home';
import Settings from '@/views/Settings';
import Auth from "../views/Auth";
import firebase from 'firebase/app'
import 'firebase/firestore';
import 'firebase/auth';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        name: 'Home',
      },
    ],
    beforeEnter: authGuard
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
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
    component: PageNotFound
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

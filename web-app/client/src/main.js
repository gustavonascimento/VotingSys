import Vue from 'vue'
import Vuex from "vuex"
import Router from 'vue-router'
import App from './App.vue'
// import router from './router'

import Home from '@/components/Home'
import CastBallot from '@/components/CastBallot'
import QueryAll from '@/components/QueryAll'
import QueryWithQueryString from '@/components/QueryWithQueryString'
import QueryByKey from '@/components/QueryByKey'
import GetCurrentStanding from '@/components/GetCurrentStanding'
import GetCurrentStandingAdmin from '@/components/GetCurrentStandingAdmin'
import CreateNewElection from '@/components/CreateNewElection'
import Admin from '@/components/Admin'
import Register from '@/components/Register'

import "@/plugins/echarts"


Vue.config.productionTip = false
Vue.use(Vuex);
Vue.use(Router)

const store = new Vuex.Store(
  {
      state: {
          authenticated: false
      },
      mutations: {
          setAuthentication(state, status) {
              state.authenticated = status;
          }
      }
  }
);

const router = new Router({
  // mode: 'abstract',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/castBallot',
      name: 'CastBallot',
      component: CastBallot
    },
    {
      path: '/Admin',
      name: 'Admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        if(store.state.authenticated == false) {
            next(false);
        } else {
            next();
        }
      } 
    },
    {
      path: '/queryAll',
      name: 'QueryAll',
      component: QueryAll,
      beforeEnter: (to, from, next) => {
        if(store.state.authenticated == false) {
            next(false);
        } else {
            next();
        }
      }
    },
    {
      path: '/queryWithQueryString',
      name: 'QueryWithQueryString',
      component: QueryWithQueryString,
      beforeEnter: (to, from, next) => {
        if(store.state.authenticated == false) {
            next(false);
        } else {
            next();
        }
      }
    },
    {
      path: '/queryByKey',
      name: 'QueryByKey',
      component: QueryByKey,
      beforeEnter: (to, from, next) => {
        if(store.state.authenticated == false) {
            next(false);
        } else {
            next();
        }
      }
    },
    {
      path: '/getCurrentStanding',
      name: 'GetCurrentStanding',
      component: GetCurrentStanding
    },
    {
      path: '/getCurrentStandingAdmin',
      name: 'GetCurrentStandingAdmin',
      component: GetCurrentStandingAdmin,
      beforeEnter: (to, from, next) => {
        if(store.state.authenticated == false) {
            next(false);
        } else {
            next();
        }
      }
    },
    {
      path: '/CreateNewElection',
      name: 'CreateNewElection',
      component: CreateNewElection
    },
    {
      path: '/Register',
      name: 'Register',
      component: Register
    }
    // {path: '*', redirect: '/'}
  ]
});

new Vue({
  render: function (h) { return h(App) },
  router: router,
  store: store
}).$mount('#app')




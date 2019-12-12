import Vue from 'vue'
import Vuex from "vuex"
import Router from 'vue-router'

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
import Secure from '@/components/Secure'

Vue.config.productionTip = false;

Vue.use(Router)
Vue.use(Vuex);

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
      component: QueryAll
    },
    {
      path: '/queryWithQueryString',
      name: 'QueryWithQueryString',
      component: QueryWithQueryString
    },
    {
      path: '/queryByKey',
      name: 'QueryByKey',
      component: QueryByKey
    },
    {
      path: '/getCurrentStanding',
      name: 'GetCurrentStanding',
      component: GetCurrentStanding
    },
    {
      path: '/getCurrentStandingAdmin',
      name: 'GetCurrentStandingAdmin',
      component: GetCurrentStandingAdmin
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

export default router;
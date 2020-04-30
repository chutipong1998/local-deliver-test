import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '@/views/Home'
import PageNotFound from '@/views/PageNotFound'
import Summary from '@/views/Summary'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HomePage',
      component: HomePage
    },
    {
      path: '*',
      name: 'PageNotFound',
      component: PageNotFound
    },
    {
      path: '/summary/:id',
      name: 'summary',
      component: Summary
    }
  ]
})

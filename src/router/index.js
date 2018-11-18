import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import FleetStatus from '@/components/FleetStatus'
import Rankings from '@/components/Rankings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/app',
      name: 'FleetStatus',
      component: FleetStatus
    },
    {
      path: '/rankings',
      name: 'Rankings',
      component: Rankings
    }
  ]
})

import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: require('../components/Home.vue').default
    },
    {
      path: '/status',
      name: 'Status',
      component: require('../components/FleetStatus/Status.vue').default
    },
    {
      path: '/status/drivers',
      name: 'DriversStatus',
      component: require('../components/FleetStatus/DriversStatus.vue').default
    },
    {
      path: '/status/passengers',
      name: 'PassengersStatus',
      component: require('../components/FleetStatus/PassengersStatus.vue').default
    },
        {
      path: '/status/journeys',
      name: 'JourneysStatus',
      component: require('../components/FleetStatus/JourneysStatus.vue').default
    },
    {
      path: '/rankings',
      name: 'Rankings',
      component: require('../components/Rankings.vue').default
    }
  ]
})

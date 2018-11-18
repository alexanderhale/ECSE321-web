import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Status from '@/components/FleetStatus/Status'
import DriversStatus from '@/components/FleetStatus/DriversStatus'
import PassengersStatus from '@/components/FleetStatus/PassengersStatus'
import JourneysStatus from '@/components/FleetStatus/JourneysStatus'
import Rankings from '@/components/Rankings'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/status',
      name: 'Status',
      component: Status
    },
    {
      path: '/status/drivers',
      name: 'DriversStatus',
      component: DriversStatus
    },
    {
      path: '/status/passengers',
      name: 'PassengersStatus',
      component: PassengersStatus
    },
        {
      path: '/status/journeys',
      name: 'JourneysStatus',
      component: JourneysStatus
    },
    {
      path: '/rankings',
      name: 'Rankings',
      component: Rankings
    }
  ]
})

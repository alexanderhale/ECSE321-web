import { baseUrl } from '../apiConfig';
import axios from 'axios';
import moment from 'moment';

const computeDriverRating = (id, startDate, endDate, journeys) => {
  const driverJourneys = journeys
    // find journeys associated with driver according to id input and journeys that are closed
	.filter(j => j.driver == id && j.closed)
	// find journeys between the startDate and endDate inputs using momentjs
    .filter(j => {
	  // timePickup is in the form of 'YYYY/MM/DD-HH:mm' and we are only interested in date, so we take string until '-' character
      const pickupDate = moment(
        j.timePickup.substring(0, j.timePickup.indexOf('-'))
	  ).format('YYYY-MM-DD');
	  // use moment isBetween function
      return (
        moment(pickupDate, 'YYYY-MM-DD').isBetween(startDate, endDate) ||
        !startDate ||
        !endDate
      );
	});
  // add up all the drivers ratings and divide them by their total number of journeys for that time period
  const rating = driverJourneys.length != 0
    ? driverJourneys.reduce((a, b) => a + b.rating, 0) / driverJourneys.length
	: 0;
  return Math.ceil(rating * 2) / 2 //make sure rating is rounded to nearest .5
};

// map through drivers and return relevant information from model
const computeTopPerformingDrivers = (drivers, startDate, endDate, journeys) => {
  return drivers
    .map(driver => ({
      username: driver.username,
      name: driver.name,
	  carModel: driver.carModel,
	  // compute rating using method defined above
      rating: computeDriverRating(driver.driverid, startDate, endDate, journeys)
	}))
	.filter(d => d.rating != 0) // don't show driver if their rating is 0 (this means they haven't ridden in the timeframe)
    .sort((a, b) => b.rating - a.rating);
};

// map through passengers and return relevant information from model
const computeMostLoyalPassengers = (passengers, startDate, endDate) => {
  return passengers
    .map(passenger => ({
      username: passenger.username,
      name: passenger.name,
      numberrides: passenger.numberrides
    }))
    .sort((a, b) => b.numberrides - a.numberrides);
};

// using dictionary to keep track of most popular routes
const computeMostPopularRoutes = (journeys, startDate, endDate) => {
  const freqDict = {};
  journeys.forEach(journey => {
	// timePickup is in the form of 'YYYY/MM/DD-HH:mm' and we are only interested in date, so we take string until '-' character
    const pickupDate = moment(
      journey.timePickup.substring(0, journey.timePickup.indexOf('-'))
    ).format('YYYY-MM-DD');
    if (
      ( moment(pickupDate, 'YYYY-MM-DD').isBetween(startDate, endDate) ||
      !startDate ||
	  !endDate) &&
	  journey.closed // make sure journey is closed
    ) {
	  // routeKey is unique string made up of startCity and endCity joined with '-'
	  const routeKey = `${journey.startCity.trim()}-${journey.endCity.trim()}`;
	  // check if routeKey is already in our freqDict and if it is simply increment value of that route
	  if (routeKey in freqDict) freqDict[routeKey] += 1;
	  // otherwise initialize to 1
      else freqDict[routeKey] = 1;
    }
  });
  // iterate through our dictionary and return array containing objects that describe how many times each route was travelled
  return Object.keys(freqDict).map(routeKey => {
    const startCity = routeKey.substring(0, routeKey.indexOf('-'));
    const endCity = routeKey.substring(startCity.length + 1);
    return { startCity, endCity, timesTravelled: freqDict[routeKey] };
  })
  .sort((a, b) => b.timesTravelled - a.timesTravelled );
};

export default {
  name: 'rankings',
  data() {
    return {
      selectedCategory: '',
      drivers: [],
      passengers: [],
      journeys: [],
      topPerformingDrivers: null,
      mostLoyalPassengers: null,
      mostPopularJourneys: null,
      startDateFilter: '',
      endDateFilter: ''
    };
  },
  methods: {
    setCategory(val) {
      this.selectedCategory = val;
    },

    resetCategory() {
      this.selectedCategory = null;
    },

    checkCategory(val) {
      return this.selectedCategory == val;
    },

    updateRankings() {
      //get dates
      const startDate = moment(this.startDateFilter);
      const endDate = moment(this.endDateFilter);

      if (startDate._isValid && endDate._isValid) {
        // update drivers
        this.topPerformingDrivers = computeTopPerformingDrivers(
          this.drivers,
          startDate,
          endDate,
          this.journeys
        );
        // update passengers
        this.mostLoyalPassengers = computeMostLoyalPassengers(
          this.passengers,
          startDate,
          endDate
        );
        // update journeys
        this.mostPopularJourneys = computeMostPopularRoutes(
          this.journeys,
          startDate,
          endDate
        );
      } else {
        // update drivers
        this.topPerformingDrivers = computeTopPerformingDrivers(
          this.drivers,
          null,
          null,
          this.journeys
        );
        // update passengers
        this.mostLoyalPassengers = computeMostLoyalPassengers(
          this.passengers,
          null,
          null
        );
        // update journeys
        this.mostPopularJourneys = computeMostPopularRoutes(
          this.journeys,
          null,
          null
        );
      }
    },
    computeFilterState() {
	  // if one date input is selected return false so UI shows error
      if (this.startDateFilter.length == 0 && this.endDateFilter.length == 0)
        return null;
      else if (
        this.startDateFilter.length != 0 &&
        this.endDateFilter.length == 0
      )
        return false;
      else if (
        this.endDateFilter.length != 0 &&
        this.startDateFilter.length == 0
      )
        return false;
	},
	// we should show alert if there are no journeys or drivers found in the timeframe, or if number of rides are 0 for passengers
	computeAlertState() {
	  return this.mostPopularJourneys.length == 0 ||
	  this.topPerformingDrivers.length == 0 ||
	  this.mostLoyalPassengers.filter(p => p.numberrides != 0).length == 0 // check if all numberrides are 0
	}
  },

  mounted() {
    axios
      .get(`${baseUrl}/journey/all`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.journeys = res.data;

        this.mostPopularJourneys = computeMostPopularRoutes(
          this.journeys,
          null,
          null
        );
      })
      .catch(err => console.error(err));

    axios
      .get(`${baseUrl}/driver/admin/all`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.drivers = res.data;

        // update drivers
        this.topPerformingDrivers = computeTopPerformingDrivers(
          this.drivers,
          null,
          null,
          this.journeys
        );
      })
      .catch(err => console.error(err));

    axios
      .get(`${baseUrl}/rider/admin/all`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(res => {
        this.passengers = res.data;

        this.mostLoyalPassengers = computeMostLoyalPassengers(
          this.passengers,
          null,
          null
        );
      })
      .catch(err => console.error(err));
  }
};

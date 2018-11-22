import { baseUrl } from '../apiConfig';
import axios from 'axios';
import moment from 'moment';

const computeTopPerformingDrivers = (drivers, startDate, endDate) => {
  const freqDict = {};
  drivers.forEach(driver => {
    const driverKey = `${driver.driverid}-${driver.rating}`;
  });
  return Object.keys(freqDict).map(routeKey => {
    const driverId = driverKey.substring(0, driverKey.indexOf('-'));
    const driverRating = driverKey.substring(driverId.length + 1);
    return {driverId, driverRating};
  });
};

const computeMostLoyalPassengers = (riders, startDate, endDate) => {
  const freqDict = {};
  riders.forEach(rider => {
    const passengerKey = `${rider.riderid}-${rider.rating}`;
  });
  return Object.keys(freqDict).map(routeKey => {
    const passengerId = passengerKey.substring(0, passengerKey.indexOf('-'));
    const passengerRating = passengerKey.substring(passengerId.length + 1);
    return {passengerId, passengerRating};
  });
};

const computeMostPopularRoutes = (journeys, startDate, endDate) => {
  const freqDict = {};
  journeys.forEach(journey => {
    const pickupDate = moment(
      journey.timePickup.substring(0, journey.timePickup.indexOf('-'))
    ).format('YYYY-MM-DD');
    if (
      moment(pickupDate, 'YYYY-MM-DD').isBetween(startDate, endDate) ||
      !startDate ||
      !endDate
    ) {
      const routeKey = `${journey.startCity.trim()}-${journey.endCity.trim()}`;
      if (routeKey in freqDict) freqDict[routeKey] += 1;
      else freqDict[routeKey] = 1;
    }
  });
  return Object.keys(freqDict).map(routeKey => {
    const startCity = routeKey.substring(0, routeKey.indexOf('-'));
    const endCity = routeKey.substring(startCity.length + 1);
    return {startCity, endCity, timesTravelled: freqDict[routeKey]};
  });
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
      if (this.selectedCategory == val) {
        return true;
      } else {
        return false;
      }
    },

    updateRankings() {
      //get dates
      const startDate = moment(this.startDateFilter);
      const endDate = moment(this.endDateFilter);

      if (startDate._isValid && endDate._isValid) {
        // update drivers
        this.topPerformingDrivers = computeTopPerformingDrivers(
          this.drivers, startDate, endDate
        );
        // update passengers
        this.mostLoyalPassengers = computeMostLoyalPassengers(
          this.passengers, startDate, endDate
        );
        // update journeys
        this.mostPopularJourneys = computeMostPopularRoutes(
          this.journeys, startDate, endDate
        );
      } else {
        // update drivers
        this.topPerformingDrivers = computeTopPerformingDrivers(
          this.drivers, null, null
        );
        // update passengers
        this.mostLoyalPassengers = computeMostLoyalPassengers(
          this.passengers, null, null
        );
        // update journeys
        this.mostPopularJourneys = computeMostPopularRoutes(
          this.journeys, null, null
        );
      }
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
        // update drivers
        this.topPerformingDrivers = computeTopPerformingDrivers(
          this.drivers, null, null
        );
        // update passengers
        this.mostLoyalPassengers = computeMostLoyalPassengers(
          this.passengers, null, null
        );
        // update journeys
        this.mostPopularJourneys = computeMostPopularRoutes(
          this.journeys, null, null
        );
      })
      .catch(err => console.error(err));
  }
};

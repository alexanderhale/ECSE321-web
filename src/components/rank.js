import { baseUrl } from '../apiConfig';
import axios from 'axios';
import moment from 'moment';

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
    return {
      startCity,
      endCity,
      timesTravelled: freqDict[routeKey]
    };
  });
};

export default {
  name: 'rankings',
  data() {
    return {
      selectedCategory: '',
      journeys: [],
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

    updateJourneys() {
      const startDate = moment(this.startDateFilter);
      const endDate = moment(this.endDateFilter);
      if (startDate._isValid && endDate._isValid) {
        this.mostPopularJourneys = computeMostPopularRoutes(
          this.journeys,
          startDate,
          endDate
        );
      } else {
        this.mostPopularJourneys = computeMostPopularRoutes(
          this.journeys,
          null,
          null
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
        this.mostPopularJourneys = computeMostPopularRoutes(
          res.data,
          null,
          null
        );
      })
      .catch(err => console.error(err));
  }
};

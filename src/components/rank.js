import { baseUrl } from '../apiConfig';
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'rankings',
  data() {
    return {
      selectedCategory: '',
      journeys: [],
      filteredJourneys: null,
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
      if (!startDate._isValid && !endDate._isValid)
        this.filteredJourneys = null;
      else {
        this.filteredJourneys = this.journeys.filter(j =>
          this.startDateFilter && this.endDateFilter
            ? moment(j.date, 'YYYY-MM-DD').isBetween(startDate, endDate)
            : true
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
      .then(
        res =>
          (this.journeys = res.data
            .map(journey => {
              return {
                startAddress: journey.startAddress,
                startCity: journey.startCity,
                startCountry: journey.startCountry,
                endAddress: journey.endAddress,
                endCity: journey.endCity,
                endCountry: journey.endCountry,
                rating: journey.rating,
                date: moment(
                  journey.timePickup.substring(
                    0,
                    journey.timePickup.indexOf('-')
                  )
                ).format('YYYY-MM-DD')
              };
            })
            .sort((a, b) => b.rating - a.rating))
      )
      .catch(err => console.error(err));
  }
};

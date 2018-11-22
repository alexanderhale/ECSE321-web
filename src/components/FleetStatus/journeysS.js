import axios from 'axios';
import {baseUrl} from "../../apiConfig";

const getJourneys = (journeys, searchBarText) => {
  console.log('Text is ' + searchBarText);
  const rankDict = {}
  journeys.forEach(journey => {
    //console.log(journeys.length)
    const journeyID = journey.journeyid;
    const startAddress = journey.startAddress;
    const endAddress = journey.endAddress;
    const price = journey.price;
    const rating = journey.rating;
    const journeyKey = `${journeyID}dIDd${startAddress}dFNd${endAddress}dUNd${rating}dCMd${price}`;
    rankDict[journeyKey] = 1;
    // }
  });
  if(searchBarText == ''){
    return Object.keys(rankDict).map(journeyKey => {
      const journeyID = journeyKey.substring(0, journeyKey.indexOf('dIDd'));
      const startAddress = journeyKey.substring(journeyKey.indexOf('dIDd') + 4, journeyKey.indexOf('dFNd'));
      const endAddress = journeyKey.substring(journeyKey.indexOf('dFNd') + 4, journeyKey.indexOf('dUNd'));
      const rating = journeyKey.substring(journeyKey.indexOf('dUNd') + 4, journeyKey.indexOf('dCMd'));
      const price = journeyKey.substring(journeyKey.indexOf('dCMd') + 4, journeyKey.length);
      return {
        journeyID,
        startAddress,
        endAddress,
        rating,
        price
      };
    });
  }
};

export default {
  name: 'status',
  data() {
    return {
      journeys: [],
      journeysMatched: null,
      searchText: '',
    }
  },
  methods: {
    updateJourneysTable() {
      this.journeysMatched = getJourneys(this.journeys, this.searchText);
    }
  },

  created() {
    axios.get(baseUrl + `/journey/all`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res =>{
        this.journeys = res.data;
        this.journeysMatched = getJourneys(res.data, this.searchText);
      })
      .catch(err => console.error(err))
  }
}

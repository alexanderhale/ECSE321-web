import axios from 'axios';
import {baseUrl} from "../../apiConfig";

// Function to sort alphabetically
function dynamicSort(attribute) {
    var sortOrder = 1;
    if(attribute[0] === "-") {
        sortOrder = -1;
        attribute = attribute.substr(1);
    }
    return function (a,b) {
        if(sortOrder == -1){
            return b[attribute].localeCompare(a[attribute]);
        }else{
            return a[attribute].localeCompare(b[attribute]);
        }        
    }
}

const getJourneys = (journeys, searchBarText) => {
  const rankDict = {}
  journeys.forEach(journey => {
    const journeyID = journey.journeyid;
    const startAddress = journey.startAddress;
    const startCity = journey.startCity;
    const startCountry = journey.startCountry;
    const endAddress = journey.endAddress;
    const endCity = journey.endCity;
    const endCountry = journey.endCountry;
    const price = journey.price;
    const rating = journey.rating;
    const journeyKey = `${journeyID}dIDd${startAddress}dSAd${startCity}dSCd${startCountry}dSPd${endAddress}dEAd${endCity}dECd${endCountry}dEPd${rating}dCMd${price}`;
    rankDict[journeyKey] = 1;
    // }
  });

  var allJourneys = Object.keys(rankDict).map(journeyKey => {
      const journeyID = journeyKey.substring(0, journeyKey.indexOf('dIDd'));
      const startAddress = journeyKey.substring(journeyKey.indexOf('dIDd') + 4, journeyKey.indexOf('dSAd'));
      const startCity = journeyKey.substring(journeyKey.indexOf('dSAd') + 4, journeyKey.indexOf('dSCd'));
      const startCountry = journeyKey.substring(journeyKey.indexOf('dSCd') + 4, journeyKey.indexOf('dSPd'));
      const endAddress = journeyKey.substring(journeyKey.indexOf('dSPd') + 4, journeyKey.indexOf('dEAd'));
      const endCity = journeyKey.substring(journeyKey.indexOf('dEAd') + 4, journeyKey.indexOf('dECd'));
      const endCountry = journeyKey.substring(journeyKey.indexOf('dECd') + 4, journeyKey.indexOf('dEPd'));      
      const rating = journeyKey.substring(journeyKey.indexOf('dEPd') + 4, journeyKey.indexOf('dCMd'));
      const price = journeyKey.substring(journeyKey.indexOf('dCMd') + 4, journeyKey.length);
      return {
        journeyID,
        startAddress,
        startCity,
        startCountry,
        endAddress,
        endCity,
        endCountry,
        rating,
        price
      };

    });

  var matchedJourneys = Object.keys(rankDict).map(journeyKey => {
      const journeyID = journeyKey.substring(0, journeyKey.indexOf('dIDd'));
      const startAddress = journeyKey.substring(journeyKey.indexOf('dIDd') + 4, journeyKey.indexOf('dSAd'));
      const startCity = journeyKey.substring(journeyKey.indexOf('dSAd') + 4, journeyKey.indexOf('dSCd'));
      const startCountry = journeyKey.substring(journeyKey.indexOf('dSCd') + 4, journeyKey.indexOf('dSPd'));
      const endAddress = journeyKey.substring(journeyKey.indexOf('dSPd') + 4, journeyKey.indexOf('dEAd'));
      const endCity = journeyKey.substring(journeyKey.indexOf('dEAd') + 4, journeyKey.indexOf('dECd'));
      const endCountry = journeyKey.substring(journeyKey.indexOf('dECd') + 4, journeyKey.indexOf('dEPd'));      
      const rating = journeyKey.substring(journeyKey.indexOf('dEPd') + 4, journeyKey.indexOf('dCMd'));
      const price = journeyKey.substring(journeyKey.indexOf('dCMd') + 4, journeyKey.length);
      if(String(endAddress.toLowerCase()).includes(searchBarText.toLowerCase()) || 
        String(endCity.toLowerCase()).includes(searchBarText.toLowerCase()) ||
        String(endCountry.toLowerCase()).includes(searchBarText.toLowerCase()) ||
        String(startAddress.toLowerCase()).includes(searchBarText.toLowerCase()) ||
        String(startCity.toLowerCase()).includes(searchBarText.toLowerCase()) ||
        String(startCountry.toLowerCase()).includes(searchBarText.toLowerCase())){
        return {
          journeyID,
          startAddress,
          startCity,
          startCountry,
          endAddress,
          endCity,
          endCountry,
          rating,
          price
        };
      }
    });
  var filteredJourneys = matchedJourneys.filter(function (journey) {
  return journey != null;
  });
  // Sorting the drivers alphabetically
  filteredJourneys.sort(dynamicSort("endCity"));
  if(searchBarText == ''){
    return allJourneys;
  }else{
    return filteredJourneys;
  }
};

export default {
  name: 'status',
  data() {
    return {
      journeys: [],
      journeysMatched: [],
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

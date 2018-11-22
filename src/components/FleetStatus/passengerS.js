import axios from 'axios';
import {baseUrl} from "../../apiConfig";

const getRiders = (riders, searchBarText) => {
  console.log('Text is ' + searchBarText);
  const rankDict = {}
  riders.forEach(rider => {
    //console.log(riders.length)
    const riderID = rider.riderid;
    const username = rider.username;
    const name = rider.name;
    const rating = rider.rating;
    const numberRides = rider.numberrides;

    const riderKey = `${riderID}dIDd${username}dFNd${name}dUNd${rating}dCMd${numberRides}`;
    rankDict[riderKey] = 1;
    // }
  });
  if(searchBarText == ''){
    return Object.keys(rankDict).map(riderKey => {
      const riderID = riderKey.substring(0, riderKey.indexOf('dIDd'));
      const username = riderKey.substring(riderKey.indexOf('dIDd') + 4, riderKey.indexOf('dFNd'));
      const name = riderKey.substring(riderKey.indexOf('dFNd') + 4, riderKey.indexOf('dUNd'));
      const rating = riderKey.substring(riderKey.indexOf('dUNd') + 4, riderKey.indexOf('dCMd'));
      const numberRides = riderKey.substring(riderKey.indexOf('dCMd') + 4, riderKey.length);
      return {
        riderID,
        username,
        name,
        rating,
        numberRides
      };
    });
  }
};

export default {
  name: 'status',
  data() {
    return {
      riders: [],
      ridersMatched: null,
      searchText: '',
    }
  },
  methods: {
    updateRidersTable() {
      this.ridersMatched = getRiders(this.riders, this.searchText);
    }
  },

  created() {
    axios.get(baseUrl + `/rider/admin/all`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res =>{
        this.riders = res.data;
        this.ridersMatched = getRiders(res.data, this.searchText);
      })
      .catch(err => console.error(err))
  }
}

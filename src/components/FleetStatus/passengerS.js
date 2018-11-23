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

const getRiders = (riders, searchBarText) => {
  //Putting all the riders in a dict
  const rankDict = {}
  riders.forEach(rider => {
    // Fetching the attributes for each rider
    const riderID = rider.riderid;
    const username = rider.username;
    const name = rider.name;
    const rating = rider.rating;
    const status = rider.status;
    const numberRides = rider.numberrides;
    //Adding custom separators between the attributes to be able to separate the substrings later
    const riderKey = `${riderID}dIDd${username}dFNd${name}dUNd${rating}dCMd${numberRides}dSTd${status}`;
    rankDict[riderKey] = 1;
    // }
  });
  // Using that dict to add riders into an Array allDrivers
  var allRiders = Object.keys(rankDict).map(riderKey => {
      // Using the separators that we established earlier
      const riderID = riderKey.substring(0, riderKey.indexOf('dIDd'));
      const username = riderKey.substring(riderKey.indexOf('dIDd') + 4, riderKey.indexOf('dFNd'));
      const name = riderKey.substring(riderKey.indexOf('dFNd') + 4, riderKey.indexOf('dUNd'));
      const rating = riderKey.substring(riderKey.indexOf('dUNd') + 4, riderKey.indexOf('dCMd'));
      const numberRides = riderKey.substring(riderKey.indexOf('dCMd') + 4, riderKey.indexOf('dSTd'));
      var status = riderKey.substring(riderKey.indexOf('dSTd') + 4, riderKey.length);
      if(status == 'false'){
        status = "Not Riding"
      }else{
        status = "Riding"
      }
      return {
        riderID,
        username,
        name,
        rating,
        numberRides,
        status
      };
    });
  // Similar function as the above one but here we are using the search bar text to filter
  var matchedRiders = Object.keys(rankDict).map(riderKey => {
      const riderID = riderKey.substring(0, riderKey.indexOf('dIDd'));
      const username = riderKey.substring(riderKey.indexOf('dIDd') + 4, riderKey.indexOf('dFNd'));
      const name = riderKey.substring(riderKey.indexOf('dFNd') + 4, riderKey.indexOf('dUNd'));
      const rating = riderKey.substring(riderKey.indexOf('dUNd') + 4, riderKey.indexOf('dCMd'));
      const numberRides = riderKey.substring(riderKey.indexOf('dCMd') + 4, riderKey.indexOf('dSTd'));
      var status = riderKey.substring(riderKey.indexOf('dSTd') + 4, riderKey.length);
      if(status == 'false'){
        status = "Not Riding"
      }else{
        status = "Riding"
      }
      // Checking if the fullname or username matches the text typed in the search bar, 
      // if not don't add the rider
      if(String(name.toLowerCase()).includes(searchBarText.toLowerCase()) ||
        String(username.toLowerCase()).includes(searchBarText.toLowerCase())){
        return {
          riderID,
          username,
          name,
          rating,
          numberRides,
          status
        };
      }
    });
  // Removing the undefined & null fields from the matched array
  var filteredRiders = matchedRiders.filter(function (rider) {
  return rider != null;
  });
  // Sorting the riders alphabetically
  filteredRiders.sort(dynamicSort("name"));
  // In case nothing was typed in the search bar, return all riders
  if(searchBarText == ''){
    return allRiders;
  }else{
    return filteredRiders;
  }
};

export default {
  name: 'status',
  data() {
    return {
      riders: [],
      ridersMatched: [],
      searchText: '',
    }
  },
  methods: {
    // Method for when Vue detects a change of text in the search bar (from @input attribute)
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

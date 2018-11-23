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
const getDrivers = (drivers, searchBarText) => {
  const rankDict = {}
  drivers.forEach(driver => {
    const driverID = driver.driverid;
    const username = driver.username;
    const fullname = driver.name;
    const carModel = driver.carModel;
    const age = driver.age;
    //Adding custom separators between the attributes to be able to separate the substrings later
    const driverKey = `${driverID}dIDd${fullname}dFNd${username}dUNd${carModel}dCMd${age}`;
    //Storing the drivers in a dict
    rankDict[driverKey] = 1;
  });

  var allDrivers = Object.keys(rankDict).map(driverKey => {
      const driverID = driverKey.substring(0, driverKey.indexOf('dIDd'));
      const fullname = driverKey.substring(driverKey.indexOf('dIDd') + 4, driverKey.indexOf('dFNd'));
      const username = driverKey.substring(driverKey.indexOf('dFNd') + 4, driverKey.indexOf('dUNd'));
      const carModel = driverKey.substring(driverKey.indexOf('dUNd') + 4, driverKey.indexOf('dCMd'));
      const age = driverKey.substring(driverKey.indexOf('dCMd') + 4, driverKey.length);
      return {
        driverID,
        fullname,
        username,
        carModel,
        age
      };
    })
  var matchedDrivers = Object.keys(rankDict).map(driverKey => {
      const driverID = driverKey.substring(0, driverKey.indexOf('dIDd'));
      const fullname = driverKey.substring(driverKey.indexOf('dIDd') + 4, driverKey.indexOf('dFNd'));
      const username = driverKey.substring(driverKey.indexOf('dFNd') + 4, driverKey.indexOf('dUNd'));
      const carModel = driverKey.substring(driverKey.indexOf('dUNd') + 4, driverKey.indexOf('dCMd'));
      const age = driverKey.substring(driverKey.indexOf('dCMd') + 4, driverKey.length);
      // Checking if the fullname matches the text typed in the search bar, if not don't add the driver
      if(String(fullname.toLowerCase()).includes(searchBarText.toLowerCase())){
        return {
          driverID,
          fullname,
          username,
          carModel,
          age
        };
      }
    })
  // Removing the undefined & null fields from the matched array
  var filteredDrivers = matchedDrivers.filter(function (driver) {
  return driver != null;
  });
  // Sorting the drivers alphabetically
  filteredDrivers.sort(dynamicSort("fullname"));
  // In case nothing was typed in the search bar, return all drivers
  if(searchBarText == ''){
    return allDrivers;
  }else{
    return filteredDrivers;
  }
};

export default {
  name: 'status',
  data() {
    return {
      drivers: [],
      driversMatched: [],
      searchText: '',
    }
  },
  methods: {
    updateDriversTable() {
      this.driversMatched = getDrivers(this.drivers, this.searchText);
      console.log(getDrivers(this.drivers, this.searchText))
    }
  },

  created() {
    axios.get(baseUrl + `/driver/admin/all`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res =>{
        this.drivers = res.data;
        this.driversMatched = getDrivers(res.data, this.searchText);
      })
      .catch(err => console.error(err))
  }
}

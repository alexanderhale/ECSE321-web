import axios from 'axios';
import {baseUrl} from "../../apiConfig";

const getDrivers = (drivers, searchBarText) => {
  console.log('Text is ' + searchBarText);
  const rankDict = {}
  drivers.forEach(driver => {
    //console.log(drivers.length)
    const driverID = driver.driverid;
    const username = driver.username;
    const fullname = driver.name;
    const carModel = driver.carModel;
    const age = driver.age;
    const driverKey = `${driverID}dIDd${fullname}dFNd${username}dUNd${carModel}dCMd${age}`;
    rankDict[driverKey] = 1;
    // }
  });
  if(searchBarText == ''){
    return Object.keys(rankDict).map(driverKey => {
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
    });
  }
};

export default {
  name: 'status',
  data() {
    return {
      drivers: [],
      driversMatched: null,
      searchText: '',
    }
  },
  methods: {
    updateDriversTable() {
      this.driversMatched = getDrivers(this.drivers, this.searchText);
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

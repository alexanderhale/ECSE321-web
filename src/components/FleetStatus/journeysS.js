import axios from 'axios';
import {baseUrl} from "../../apiConfig";

  export default {
    name: 'status',
    data() {
      return {
        journeys: []
      }
    },

    created() {
      axios.get(baseUrl + `/journey/all`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => this.journeys = res.data)
        .catch(err => console.error(err))
    }
  }

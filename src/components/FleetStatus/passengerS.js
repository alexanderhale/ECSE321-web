import axios from 'axios';
import {baseUrl} from "../../apiConfig";

  export default {
    name: 'status',
    data() {
      return {
        riders: []
      }
    },

    created() {
      axios.get(baseUrl + `/rider/admin/all`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => this.riders = res.data)
        .catch(err => console.error(err))
    }
  }

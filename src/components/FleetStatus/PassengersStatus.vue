<template>
  <div id="passengers_status">
    <h2>Passenger Status</h2>
    <ul>
      <li v-for="rider in riders">{{rider}}</li>
    </ul>
    <div style="padding-top: 20px;">
      <b-button-group vertical size="lg">
        <b-button href="#/status/">Back</b-button>
        <b-button href="#/">Home</b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
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
      axios.get(baseUrl + `/rider/secure/all`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(res => this.riders = res.data)
        .catch(err => console.error(err))
    }
  }
</script>

<style>
  #ridesharing {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    background: #f2ece8;
  }
</style>

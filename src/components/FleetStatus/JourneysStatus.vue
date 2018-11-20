<template>
  <div id="journeys_status">
    <h2>Journey Status</h2>
    <ul>
      <li v-for="journey in journeys">{{journey.startAddress}}</li>
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
</script>

<style>
  #ridesharing {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    background: #f2ece8;
  }
</style>

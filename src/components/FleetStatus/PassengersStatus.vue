<template>
  <div id="riders_status">
    <h2>Rider Status</h2>
    <div>
      <b-container fluid class="filter-inputs">
        <b-row class="input">
          <b-col sm="12"><b-form-input id="search-text" type="text" v-model="searchText" placeholder="Search Rider name or username..." @input="updateRidersTable"></b-form-input></b-col>
        </b-row>
      </b-container>
    </div>
    <b-table class="journeys-table" striped hover :items="ridersMatched"></b-table>
    <div style="padding-top: 20px;">
      <b-button-group vertical size="lg">
        <b-button href="#/status/">Back</b-button>
        <b-button href="#/">Home</b-button>
      </b-button-group>
    </div>
  </div>
</template>


<script src="./passengerS.js">
</script>


<style>
  #ridesharing {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    background: #f2ece8;
  }
</style>

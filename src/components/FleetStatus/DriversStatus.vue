<template>
  <div id="drivers_status">
    <h2>Driver Status</h2>
    <div>
      <b-container fluid class="filter-inputs">
        <b-row class="input">
          <b-col sm="12"><b-form-input id="search-text" type="text" v-model="searchText" placeholder="Search Driver name or username..." @input="updateDriversTable"></b-form-input></b-col>
        </b-row>
      </b-container>
    </div>
    <b-table class="drivers-table" striped hover :items="driversMatched"></b-table>
    <div style="padding-top: 20px;">
      <b-button-group vertical size="lg">
        <b-button href="#/status/">Back</b-button>
        <b-button href="#/">Home</b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script src="./driverS.js">
</script>

<style>
  #ridesharing {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    background: #f2ece8;
  }
  .drivers-buttons,
  .drivers-info {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
  }

  .button {
      display: block;
      margin: 20px 0;
      width: 200px;
  }

  .filter-inputs {
      width: 500px;
      margin-top: 20px;
  }

  .input {
      margin: 20px 0;
  }

  .drivers-table {
      margin-top: 32px;
      width: 100%;
  }
</style>

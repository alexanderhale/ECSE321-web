<template>
  <div class="rankings">
	<div class="ranking-buttons" v-if="!selectedCategory">
		<h2>Select a category</h2>
		<div>
			<b-button class="button" v-on:click="setCategory('drivers')">Top Drivers</b-button>
			<b-button class="button" v-on:click="setCategory('passengers')">Top Passengers</b-button>
			<b-button class="button" v-on:click="setCategory('journeys')">Top Journeys</b-button>
		</div>
	</div>
	<div v-if="selectedCategory" class="ranking-info">
		<h2>Top {{ selectedCategory }}</h2>
		<b-container fluid class="filter-inputs">
			<b-row class="input">
				<b-col sm="3"><label for="start-date">Start date:</label></b-col>
      			<b-col sm="9"><b-form-input id="start-date" type="date" v-model="startDateFilter" v-on:change="updateJourneys()"></b-form-input></b-col>
			</b-row>
			<b-row class="input">
				<b-col sm="3"><label for="end-date">End date:</label></b-col>
      			<b-col sm="9"><b-form-input id="end-date" type="date" v-model="endDateFilter" v-on:change="updateJourneys()"></b-form-input></b-col>
			</b-row>
		</b-container>
		<b-table class="ranking-table" striped hover :items="mostPopularJourneys"></b-table>
	</div>	
	<div style="padding-top: 20px;">
      <b-button-group vertical size="lg">
        <b-button v-on:click="resetCategory()" v-if="selectedCategory">Back</b-button>
        <b-button href="#/">Home</b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script src="./rank.js">
</script>
<style>
#ridesharing {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    color: #2c3e50;
    background: #f2ece8;
}
.ranking-buttons,
.ranking-info {
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
    width: 600px;
    margin-top: 20px;
}

.input {
    margin: 20px 0;
}

.ranking-table {
    margin-top: 32px;
    width: 80%;
}
</style>

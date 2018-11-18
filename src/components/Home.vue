<template>
  <div class="home">
    <h1>{{ msg }}</h1>
    <div style="padding-top: 20px;">
      <b-button-group vertical size="lg">
        <b-button href="#/status">Fleet Status</b-button>
        <b-button href="#/rankings">Rankings</b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome!'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>

<template>
  <div id="app">
    <img alt="VotingSys logo" src="./assets/VotingSys.png">    
      
        <p><router-link to="/">Início</router-link>&nbsp;</p>          
        <!-- <router-link to="/castBallot">Cast Ballot</router-link>&nbsp; -->
        <!-- <router-link to="/QueryAll">Buscar</router-link>
        <router-link to="/queryByKey">Buscar pela Chave</router-link>&nbsp;  -->
        <div class="routing" v-if="this.$route.path == '/'">
            <router-link to="/getCurrentStanding">Resultados</router-link>&nbsp;
        </div>
        <!-- <router-link to="/createNewElection">Criar</router-link>&nbsp; -->

      
      <router-view></router-view>
    </div>
</template>

<script>

export default {
  name: 'app',
  components: {}  
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.chart-wrapper {
  width: 100%;
  height: 700px;
}
.echarts {
  width: 100%;
  height: 100%;
}

#loader {
  position:fixed;
  padding-top: 250px;
}

.chart-wrapper {
  padding-left:32%;
}
</style>

<template>
  <div id="app">
      
        <!-- <p><router-link to="/">Início</router-link>&nbsp;</p>-->
        <!-- <router-link to="/castBallot">Cast Ballot</router-link>&nbsp; -->
        <router-link to="/" v-on:click.native="logout()">Sair</router-link>&nbsp; 
        <br />
        <br />
        <br />
        <router-link to="/QueryAll">Buscar</router-link>&nbsp; 
        <router-link to="/queryByKey">Buscar pela Chave</router-link>&nbsp; 
        <router-link to="/getCurrentStandingAdmin">Resultados</router-link>&nbsp;
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <BreadcrumbItem>
        <a href="https://github.com/gustavonascimento/VotingSys">
          Tutorial de Configuração do sistema
        </a>
      </BreadcrumbItem>
      
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: 'app',
  methods: {
    logout() {
      this.$store.commit("setAuthentication", false);
    }
  }
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

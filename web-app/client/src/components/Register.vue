<template>
  <div id="app">    
    <div class="posts">
        <h3>Preencha este formulário para se registrar!</h3>
        <form v-on:submit="registerVoter">
          <input type="text" v-el:cpf v-model="registerData.voterId" placeholder="CPF">
          <br>
          <input type="text" v-model="registerData.registrarId" placeholder="RG">
          <br>
          <input type="text" v-model="registerData.firstName" placeholder="Nome">
          <br>
          <input type="text" v-model="registerData.lastName" placeholder="Sobrenome">
          <br>
          <input type="password" v-model="registerData.password" placeholder="Senha">
          <br>
          <input type="submit" value="Registrar">
        </form>
        <br>
      
      </div>

      <span v-if="registerReponse">
      <b>{{ registerReponse.data }}</b>
      </span>
      <br>
      <vue-instant-loading-spinner id='loader' ref="Spinner"></vue-instant-loading-spinner>
    
    </div>
</template>

<script>
import PostsService from "@/services/apiService";
import VueInstantLoadingSpinner from "vue-instant-loading-spinner/src/components/VueInstantLoadingSpinner.vue";
import { validate as validateCPF } from 'gerador-validador-cpf'

// console.log(validateCPF('02954492171'))

export default {
  name: "response",
  data() {
    return {
      loginData: {},
      registerData: {},
      registerReponse: {
        data: ""
      },
      loginReponse: {
        data: ""
      }
    };
  },
  components: {
    VueInstantLoadingSpinner
  },
  methods: {
    async registerVoter() {
      if(validateCPF(this.registerData.voterId) == false) {
          console.log("!thislogin");
          let response = 'Favor informar um CPF válido!';
          this.registerReponse.data = response;
          await this.hideSpinner();
      } else 
      if (!this.registerData.registrarId) {
        console.log("!ww");
        let response = 'Favor informar o RG!';
        this.registerReponse.data = response;
        await this.hideSpinner();
      } else if (!this.registerData.firstName) {
        console.log("!oi");
        let response = 'Favor informar o Nome!';
        this.registerReponse.data = response;
        await this.hideSpinner();
      } else if (!this.registerData.lastName) {
        console.log("!e");
        let response = 'Favor informar o Sobrenome!';
        this.registerReponse.data = response;
        await this.hideSpinner();
      } else if (!this.registerData.password) {
        console.log("!ee");
        let response = 'Favor informar a senha!';
        this.registerReponse.data = response;
        await this.hideSpinner();
      } else {
        await this.runSpinner();
        const apiResponse = await PostsService.registerVoter(
        this.registerData.voterId,
        this.registerData.registrarId,
        this.registerData.firstName,
        this.registerData.lastName,
        this.registerData.password
      );

      console.log(apiResponse);
      this.registerReponse = apiResponse;
      localStorage.setItem('LoggedUser',apiResponse.User);

      await this.hideSpinner();
      }
      
    },

    async validateVoter() {
      await this.runSpinner();
      console.log(this.loginData.voterId)
      console.log(validateCPF(this.loginData.voterId))

      if (!this.loginData.voterId) {
        console.log("!thislogin");
        let response = 'Favor informar o CPF!';
        this.loginReponse.data = response;
        await this.hideSpinner();
      } else if(!this.loginData.password) {
          let response = 'Favor informar a senha!';
          this.loginReponse.data = response;
          await this.hideSpinner();
      } else {        
          const apiResponse = await PostsService.validateVoter(
          this.loginData.voterId,
          this.loginData.password
        );
        console.log("apiResponse");
        console.log(apiResponse.data);

        if (apiResponse.data.error) {
          // console.log(apiResponse);
          console.log(apiResponse.data.error);
          this.loginReponse = apiResponse.data.error;
        } else {
          this.$router.push("castBallot");
        }

        console.log(apiResponse);
        this.loginReponse = apiResponse;
        // this.$router.push('castBallot')
        await this.hideSpinner();
      }
    },
    async validateVoterAdmin() {
      await this.runSpinner();

      if (!this.loginData.voterId) {
        console.log("!thislogin");
        let response = 'Favor informar o CPF!';
        this.loginReponse.data = response;
        await this.hideSpinner();
      } else if(!this.loginData.password) {
          let response = 'Favor informar a senha!';
          this.loginReponse.data = response;
          await this.hideSpinner();
      } else {
        const apiResponse = await PostsService.Admin(
          this.loginData.voterId,
          this.loginData.password
        );
        console.log("apiResponse");
        console.log(apiResponse.data);

        if (apiResponse.data.error) {
          // console.log(apiResponse);
          console.log(apiResponse.data.error);
          this.loginReponse = apiResponse.data.error;
        } else {
          this.$router.push("Admin");
        }

        console.log(apiResponse);
        this.loginReponse = apiResponse;
        // this.$router.push('castBallot')
        await this.hideSpinner();
      }
    },
    async runSpinner() {
      this.$refs.Spinner.show();
    },
    async hideSpinner() {
      this.$refs.Spinner.hide();
    }
  }
};
</script>
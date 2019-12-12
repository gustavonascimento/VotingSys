<template>
  <div class="posts">
    <h1>Qual seria a melhor alternativa de asfalto para o campus da FGA?</h1>
    <h3>Se você já se registrou, digitar o seu CPF abaixo</h3>
    <!--span><b>{{ response }}</b></span><br /-->
    <form v-on:submit="validateVoter">
      <input type="text" v-model="loginData.voterId" placeholder="CPF">
      <br>
      <input type="password" v-model="loginData.password" placeholder="Senha">
      <br>

      <input type="submit" value="Entrar"> &nbsp;
      <router-link to="/Register" tag="button">Registrar</router-link>
      <br>
      <br>
      <span v-if="loginReponse">
        <b>{{ loginReponse.data }}</b>
      </span>
      <br>
    </form>

    <br>

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
      await this.hideSpinner();
    },

    async validateVoter() {
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
          const apiResponse = await PostsService.validateVoter(
          this.loginData.voterId,
          this.loginData.password
        );

        if(apiResponse.data.error == 'admin') {
           this.$store.commit("setAuthentication", true);
           this.$router.push("admin");
           console.log(apiResponse.data.voterId);
           console.log(apiResponse.data);
           console.log('oi');
          //  this.$router.replace({ name: "secure" });
        } else if (apiResponse.data.error) {
          // console.log(apiResponse);
          console.log(apiResponse.data);
          this.loginReponse = apiResponse.data.error;
        } else {
          this.$router.push("castBallot");
          console.log(apiResponse.data);
          // console.log(apiResponse.data.voterId);
        }

        // console.log(apiResponse);
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

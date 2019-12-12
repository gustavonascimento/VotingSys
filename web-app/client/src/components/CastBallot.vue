<template>
  <div class="posts">
    <h1>Votação</h1>
    <input type="radio" id="one" value="Asfalto Comum" v-model="picked">
    <label for="one">Asfalto Comum</label>
    <br>
    <input type="radio" id="two" value="Asfalto de Concreto" v-model="picked">
    <label for="two">Asfalto de Concreto</label>
    <br>
    <input type="radio" id="three" value="Paralelepípedo" v-model="picked">
    <label for="three">Paralelepípedo</label>
    <br>
    <br>
    <span v-if="picked">
      Escolhido:
      <b>{{ picked }}</b>
    </span>
    <br>
    <br>
    <!--span><b>{{ response }}</b></span><br /-->
    <form v-on:submit="castBallot">
      <!-- <input type="text" value="2sww593dc034wb2twdk91r" v-model="input.electionId"  >
      <br>-->
      <input type="text" v-model="input.voterId" placeholder="CPF">
      <br>
      <input type="submit" value="Votar">
      <br>
    </form>

    <br>
    <span v-if="response">
      <b>{{ response }}</b>
    </span>
    <br>
    <vue-instant-loading-spinner id="loader" ref="Spinner"></vue-instant-loading-spinner>
  </div>
</template>

<script>
import PostsService from "@/services/apiService";
import VueInstantLoadingSpinner from "vue-instant-loading-spinner/src/components/VueInstantLoadingSpinner.vue";

export default {
  name: "response",
  data() {
    return {
      input: {},
      picked: null,
      response: null
    };
  },
  components: {
    VueInstantLoadingSpinner
  },
  methods: {
    async castBallot() {
      await this.runSpinner();

      const electionRes = await PostsService.queryWithQueryString('election');

      let electionId = electionRes.data[0].Key;

      console.log("picked: ");
      console.log(this.picked);
      console.log("voterId: ");
      console.log(this.input.voterId);
      this.response = null;

 

      //error checking for making sure to vote for a valid party
      if (this.picked === null ) {
        console.log('this.picked === null')

        let response = "Você deve escolher um candidato a quem votar!";
        this.response = response;
        await this.hideSpinner();
      
      } else if (this.input.voterId === undefined) {
        console.log('this.voterId === undefined')

        let response = "Você deve digitar o CPF para validar o voto!";
        this.response = response;
        await this.hideSpinner();

      } else {

        const apiResponse = await PostsService.castBallot(
          electionId,
          this.input.voterId,
          this.picked
        );

        console.log('apiResponse: &&&&&&&&&&&&&&&&&&&&&&&');
        console.log(apiResponse);

        if (apiResponse.data.error) {
          this.response= apiResponse.data.error;
          await this.hideSpinner();
        } else if (apiResponse.data.message) {
          this.response= `Não foi possível localizar o candidato de CPF ${this.input.voterId}. Verifique se o CPF foi cadastrado.`;
          await this.hideSpinner();
        } 
        else {
          let response = `Voto registrado com sucesso para o candidato ${this.picked} votado pelo candidato de CPF ${apiResponse.data.voterId}. Obrigado por participar da votação!`;

          this.response = response;

          console.log("cast ballot");
          console.log(this.input);
          await this.hideSpinner();
        }
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

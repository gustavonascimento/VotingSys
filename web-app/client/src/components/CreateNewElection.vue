<template>
<json-editor ref="JsonEditor" :schema="schema" v-model="model">
    <button @click="submit">Enviar</button>
</json-editor>
</template>

<script>
const SCHEMA = {
  type: 'object',
  title: 'vue-json-editor demo',
  properties: {
    name: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
  },
};
// import vue-json-ui-editor
import JsonEditor from 'vue-json-ui-editor';
export default {
  components: { JsonEditor },
  data: () => ({
    // init json schma file ( require('@/schema/newsletter') )
    schema: SCHEMA,
    // data
    model: {
      name: 'Yourtion',
    },
  }),

  methods: {
    submit(_e) {
      alert(JSON.stringify(this.model));
    },
    reset() {
      this.$refs.JsonEditor.reset();
    },
  },
};
</script>
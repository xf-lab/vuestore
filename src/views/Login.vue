<template>
  <v-layout align-center justify-center>
    <v-flex xs12 sm8 md6 lg5 xl4>
        <v-card>
            <v-toolbar dark color="blue darken-3">

            </v-toolbar>
            <v-card-text>
                <v-text-field v-model="email" autofocus color="accent" label="Email" required>
                </v-text-field>
                <v-text-field v-model="password" type="password" color="accent" label="Password" required>
                </v-text-field>
                <v-flex class="red--text" v-if="errorM">
                  {{errorM}}
                </v-flex>
            </v-card-text>
            <v-card-actions class="px-3 pb-3">
                <v-flex text-xs-right>
                    <v-btn @click="ingresar" color="primary">Ingresar</v-btn>
                </v-flex>
            </v-card-actions>
        </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from 'axios';
  export default {
    
    data: () => ({
      email: '',
      password: '',
      errorM: null
    }),
    methods: {
        ingresar(){
            let me = this;
            axios.post('usuario/login',{email: this.email, password: this.password})
                .then(respuesta => {
                    return respuesta.data;
                    //console.log(response.data.user);
                    //console.log(response.data.tokenReturn);
                })
                .then(data =>{
                    this.$store.dispatch("guardarToken",data.tokenReturn);
                    this.$router.push({name:'home'});
                })                   
                .catch(function(error){
                    console.log(error.response.status);
                    me.errorM = null;
                    if(error.response.status==404){
                      me.errorM="No existe el usuario o las credenciales son incorrectas";
                      console.log(me.errorM);
                    }else{
                      me.errorM="Conexión fallida con el servidor";
                      console.log(me.errorM);
                    }
                });
        }
    }
  }
</script>

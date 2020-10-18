<template>
  <v-app id="inspire">
    <v-app-bar
      app
      color="white"
      flat
    >
        <v-container class="py-0 fill-height">
          <v-avatar
            class="mr-10"
            color="grey darken-1"
            size="32"
          ></v-avatar>

          <v-btn
            v-for="link in links"
            :key="link"
            text
          >
            {{ link }}
          </v-btn>

          <v-spacer></v-spacer>

          <v-responsive max-width="260">
            <v-text-field
              dense
              flat
              hide-details
              rounded
              solo-inverted
            ></v-text-field>
          </v-responsive>

          <v-spacer></v-spacer>

          <v-btn icon v-if="logueado" @click="salir">
            <v-icon >
              logout
            </v-icon>
            Salir
          </v-btn>
          <v-btn icon v-else :to="{name: 'login'}">
            <v-icon>
              apps
            </v-icon>
            Login
          </v-btn>

        </v-container>
    </v-app-bar>

    <v-main class="grey lighten-3">
      <v-container>
        <v-row>
          <v-col cols="2">
            <v-sheet rounded="lg">
              <v-list color="transparent" v-if="logueado">

                <navbar></navbar>

                <v-divider class="my-2"></v-divider>

                <v-list-item
                  link
                  color="grey lighten-4"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      Refresh
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <v-col>
            <v-sheet
              min-height="70vh"
              rounded="lg"
            >
                <v-container fluid fill-height>
                  <v-slide-y-transition mode="out-in">
                    <router-view/>
                  </v-slide-y-transition>
                </v-container>

            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Navbar from './components/Navbar.vue';

  export default {
    data: () => ({
      drawer: true,
      links: [
        'Dashboard',
        'Messages',
        'Profile',
        'Updates',
      ],
      opcionesMenuLateral: [
        'categorias',
        'articulos'
      ]
    }),
    components: {
      Navbar
    },
    computed:{
      logueado(){
        return this.$store.state.usuario;
      },
      esAdministrador(){
        return this.$store.state.usuario && this.$store.state.usuario.rol == 'Administrador';
      },
      esAlmacenero(){
        return this.$store.state.usuario && this.$store.state.usuario.rol == 'Almacenero';
      },
      esVendedor(){
        return this.$store.state.usuario && this.$store.state.usuario.rol == 'Vendedor';
      }
    },
    created(){
      this.$store.dispatch("autoLogin");
    },
    methods:{
      salir(){
        this.$store.dispatch("salir");
      }
    }
  }
</script>
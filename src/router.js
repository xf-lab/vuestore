import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Login from './views/Login.vue'
import Home from './views/Home.vue'
import Categoria from './views/Categoria.vue'
import Usuario from './views/Usuario.vue'
import Articulo from './views/Articulo.vue'

Vue.use(Router)

var router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  // base: "/dynamic-menu-vue/",
  routes: [
     {
       path: "/",
      redirect: { path: "/home" },
       meta: {
         visible: false
       }
     },
    {
      path: "/home",
      name: "home",
      component: Home,
      meta: {
        visible: true,
        administrador: true,
        almacenero: true,
        vendedor: true
      }
    },
    {
      path: "/categorias",
      name: "categorías",
      component: Categoria,
      meta: {
        libre: true,
        visible: true
      }
    },
    {
      path: "/articulo",
      name: "articulos",
      component: Articulo,
      meta: {
        libre: true,
        visible: true
      }
    },
    {
      path: "/usuarios",
      name: "usuarios",
      component: Usuario,
      meta: {
        libre: true,
        visible: true,
        administrador: true,
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        libre: true,
        administrador: true,
        almacenero: true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.libre)){
    next();
  } else if ( store.state.usuario && store.state.usuario.rol == 'Administrador'){
    if (to.matched.some(record => record.meta.administrador)){
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Vendedor'){
    if (to.matched.some(record => record.meta.vendedor)){
      next();
    }
  } else if ( store.state.usuario && store.state.usuario.rol == 'Almacenero'){
    if (to.matched.some(record => record.meta.almacenero)){
      next();
    }
  } else{
    router.push('/login' )
      .catch(error => {
        console.info(error.message)
      });
  }
})
export default router;